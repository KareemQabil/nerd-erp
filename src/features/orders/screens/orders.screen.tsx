/**
 * Orders Screen
 * NerdPOS - Matching POS Screen Design
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type {
  Order,
  OrderFilters,
  OrderStats,
  OrderStatus,
} from "../types/orders.types";
import { OrdersService } from "../services/orders.service";
import {
  TrendingUp,
  DollarSign,
  ChefHat,
  Plus,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  ShoppingBag,
} from "lucide-react";
import { motion } from "motion/react";
import {
  NerdPOSColors,
  NerdPOSLayout,
  NerdPOSStyles,
} from "../../../core/theme/nerdpos-styles";

export default function OrdersScreen() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | OrderStatus>("all");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, debouncedSearch]);

  const loadData = async () => {
    try {
      setLoading(true);
      const filterToApply: OrderFilters = {
        status: activeTab === "all" ? undefined : activeTab,
        searchQuery: debouncedSearch || undefined,
      };

      // Only fetch stats on initial load or if needed (optional optimization)
      // For now we keep fetching both but don't block UI
      const promises: [Promise<Order[]>, Promise<OrderStats>] = [
        OrdersService.getOrders(filterToApply),
        OrdersService.getOrderStats(),
      ];

      const [ordersData, statsData] = await Promise.all(promises);
      setOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter locally if needed, but we are doing server side search now via loadData
  // However, keeping this for immediate feedback if we wanted client side,
  // but since we moved to server side search in loadData, we just use orders directly.
  // If the API returns filtered orders, we use them.
  const filteredOrders = orders;

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return NerdPOSColors.brand.success;
      case "preparing":
        return NerdPOSColors.brand.warning;
      case "ready":
        return NerdPOSColors.brand.info;
      case "cancelled":
        return NerdPOSColors.brand.error;
      default:
        return NerdPOSColors.text.secondary;
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "preparing":
        return ChefHat;
      case "ready":
        return Package;
      case "cancelled":
        return XCircle;
      default:
        return Clock;
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    if (!isRTL) return status;
    switch (status) {
      case "pending":
        return "معلق";
      case "preparing":
        return "قيد التحضير";
      case "ready":
        return "جاهز";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغي";
      default:
        return status;
    }
  };

  if (initialLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: NerdPOSColors.background.gradient }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-16 w-16 mx-auto mb-4"
            style={{
              border: `3px solid ${NerdPOSColors.border.subtle}`,
              borderTop: `3px solid ${NerdPOSColors.brand.primary}`,
            }}
          />
          <p
            className="font-['Almarai']"
            style={{ color: NerdPOSColors.text.secondary, fontSize: "14px" }}
            dir="auto"
          >
            {isRTL ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className={NerdPOSLayout.header.wrapper}>
        <div>
          <h1 className={NerdPOSLayout.header.title} dir="auto">
            {isRTL ? "إدارة الطلبات" : "Orders Management"}
          </h1>
          <p className={NerdPOSLayout.header.subtitle} dir="auto">
            {isRTL ? "عرض وإدارة جميع الطلبات" : "View and manage all orders"}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/pos")}
          className={
            NerdPOSStyles.button.primary +
            " h-12 px-6 flex items-center gap-2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_2px_6px_2px_rgba(0,0,0,0.15)]"
          }
        >
          <Plus className="w-5 h-5" />
          <span dir="auto">{isRTL ? "طلب جديد" : "New Order"}</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className={NerdPOSLayout.stats.grid + " lg:grid-cols-4"}>
          <div className={NerdPOSStyles.statsCard.base + " text-center"}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div
              className="text-sm font-['Almarai'] text-text-secondary mb-2"
              dir="auto"
            >
              {isRTL ? "متوسط قيمة الطلب" : "Avg Order Value"}
            </div>
            <div className="text-2xl font-['Inter'] font-bold text-text-primary">
              {stats.averageOrderValue.toFixed(2)} {isRTL ? "ر.س" : "SAR"}
            </div>
          </div>

          <div className={NerdPOSStyles.statsCard.base + " text-center"}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div
              className="text-sm font-['Almarai'] text-text-secondary mb-2"
              dir="auto"
            >
              {isRTL ? "الإيرادات" : "Revenue"}
            </div>
            <div className="text-2xl font-['Inter'] font-bold text-text-primary">
              {stats.totalRevenue.toFixed(2)} {isRTL ? "ر.س" : "SAR"}
            </div>
          </div>

          <div className={NerdPOSStyles.statsCard.base + " text-center"}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <ChefHat className="w-5 h-5 text-warning" />
            </div>
            <div
              className="text-sm font-['Almarai'] text-text-secondary mb-2"
              dir="auto"
            >
              {isRTL ? "قيد التحضير" : "Preparing"}
            </div>
            <div className="text-2xl font-['Inter'] font-bold text-text-primary">
              {stats.preparing}
            </div>
          </div>

          <div className={NerdPOSStyles.statsCard.base + " text-center"}>
            <div className="text-4xl font-['Inter'] font-bold text-text-primary mb-2">
              {stats.total}
            </div>
            <div
              className="text-sm font-['Almarai'] text-text-secondary"
              dir="auto"
            >
              {isRTL ? "إجمالي الطلبات" : "Total Orders"}
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className={NerdPOSLayout.filters.container}>
        <div className={NerdPOSLayout.filters.searchWrapper}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={isRTL ? "ابحث عن طلب..." : "Search orders..."}
            className={NerdPOSStyles.input.search}
            style={{ textAlign: isRTL ? "right" : "left" }}
            dir={isRTL ? "rtl" : "ltr"}
          />
          <Search
            className="absolute w-5 h-5 text-text-secondary top-3.5"
            style={{ [isRTL ? "right" : "left"]: "16px" }}
          />
        </div>
      </div>

      {/* Tabs - Matching POS category design */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-thin scrollbar-thumb-border-subtle scrollbar-track-transparent">
        {[
          {
            id: "all",
            label: isRTL
              ? `الكل (${stats?.total || 0})`
              : `All (${stats?.total || 0})`,
          },
          {
            id: "pending",
            label: isRTL
              ? `معلق (${stats?.pending || 0})`
              : `Pending (${stats?.pending || 0})`,
          },
          {
            id: "preparing",
            label: isRTL
              ? `يحضر (${stats?.preparing || 0})`
              : `Preparing (${stats?.preparing || 0})`,
          },
          {
            id: "ready",
            label: isRTL
              ? `جاهز (${stats?.ready || 0})`
              : `Ready (${stats?.ready || 0})`,
          },
          {
            id: "completed",
            label: isRTL
              ? `مكتمل (${stats?.completed || 0})`
              : `Completed (${stats?.completed || 0})`,
          },
          {
            id: "cancelled",
            label: isRTL
              ? `ملغي (${stats?.cancelled || 0})`
              : `Cancelled (${stats?.cancelled || 0})`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "all" | OrderStatus)}
            className={`px-6 py-2.5 rounded-xl text-sm font-['Almarai'] transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-primary text-on-primary shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_2px_6px_2px_rgba(0,0,0,0.15)]"
                : NerdPOSStyles.button.secondary
            }`}
          >
            <span dir="auto">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className={NerdPOSStyles.card.base + " p-4 h-48 animate-pulse"}
            >
              <div className="flex justify-between mb-4">
                <div className="h-6 bg-primary-container rounded w-24"></div>
                <div className="h-6 bg-primary-container rounded w-16"></div>
              </div>
              <div className="h-4 bg-primary-container rounded w-32 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-primary-container rounded w-full"></div>
                <div className="h-4 bg-primary-container rounded w-full"></div>
                <div className="h-4 bg-primary-container rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-surface-overlay flex items-center justify-center mb-4">
            <ShoppingBag className="w-12 h-12 text-text-secondary opacity-50" />
          </div>
          <h3
            className="text-xl font-['Almarai'] text-text-primary mb-2"
            dir="auto"
          >
            {isRTL ? "لا توجد طلبات" : "No Orders"}
          </h3>
          <p className="text-base text-text-secondary" dir="auto">
            {isRTL ? "لم يتم العثور على أي طلبات" : "No orders found"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order, index) => {
            const StatusIcon = getStatusIcon(order.status);
            const statusColor = getStatusColor(order.status);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.02 }}
                className={
                  NerdPOSStyles.card.base +
                  " " +
                  NerdPOSStyles.card.hover +
                  " p-4 cursor-pointer"
                }
                onClick={() => navigate(`/orders/${order.id}`)}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-['Inter'] font-bold text-primary">
                        #{order.orderNumber}
                      </span>
                      <div
                        className="px-2 py-1 rounded-md flex items-center gap-1"
                        style={{
                          backgroundColor: `${statusColor}20`,
                          border: `1px solid ${statusColor}30`,
                        }}
                      >
                        <StatusIcon
                          className="w-3 h-3"
                          style={{ color: statusColor }}
                        />
                        <span
                          className="text-xs font-['Almarai']"
                          style={{ color: statusColor }}
                          dir="auto"
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Clock className="w-4 h-4" />
                      <span className="font-['Almarai']" dir="auto">
                        {isRTL ? "منذ" : ""}{" "}
                        {new Date(order.createdAt).toLocaleTimeString(
                          isRTL ? "ar" : "en",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}{" "}
                        {!isRTL ? "ago" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer */}
                {order.customerName && (
                  <div className="mb-3">
                    <div
                      className="text-sm font-['Almarai'] text-text-primary"
                      dir="auto"
                    >
                      {order.customerName}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-1.5 mb-3 max-h-24 overflow-y-auto">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <span
                        className="font-['Almarai'] text-text-secondary"
                        dir="auto"
                      >
                        {item.quantity}x {item.productName}
                      </span>
                      <span className="font-['Inter'] text-text-primary">
                        {item.total.toFixed(2)} {isRTL ? "ر.س" : "SAR"}
                      </span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div
                      className="text-xs text-text-secondary font-['Almarai']"
                      dir="auto"
                    >
                      {isRTL
                        ? `+${order.items.length - 3} منتجات أخرى`
                        : `+${order.items.length - 3} more items`}
                    </div>
                  )}
                </div>

                {/* Total */}
                <div
                  className="flex items-center justify-between pt-3 border-t"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <span
                    className="text-sm font-['Almarai'] text-text-secondary"
                    dir="auto"
                  >
                    {isRTL ? "الإجمالي" : "Total"}
                  </span>
                  <span className="text-xl font-['Inter'] font-bold text-text-primary">
                    {order.total.toFixed(2)} {isRTL ? "ر.س" : "SAR"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
}
