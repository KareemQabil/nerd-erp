/**
 * Customers Screen
 * NerdPOS - Matching POS Screen Design
 */

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MainNavigation } from "../../../components/main-navigation";
import {
  CustomersService,
  LOYALTY_PROGRAMS,
} from "../services/customers.service";
import type {
  Customer,
  CustomerStats,
  LoyaltyTier,
} from "../types/customers.types";
import {
  Users,
  Search,
  Plus,
  Award,
  Phone,
  Mail,
  ShoppingBag,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import {
  NerdPOSColors,
  NerdPOSLayout,
  NerdPOSStyles,
} from "../../../core/theme/nerdpos-styles";

export default function CustomersScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<LoyaltyTier | "all">("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [customersData, statsData] = await Promise.all([
        CustomersService.getCustomers(),
        CustomersService.getCustomerStats(),
      ]);
      setCustomers(customersData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      searchQuery === "" ||
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier =
      selectedTier === "all" || customer.loyaltyTier === selectedTier;

    return matchesSearch && matchesTier;
  });

  const getLoyaltyProgram = (tier: LoyaltyTier) => {
    return LOYALTY_PROGRAMS.find((p) => p.tier === tier);
  };

  if (loading) {
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
    <div
      className={NerdPOSLayout.page.container}
      style={{ background: NerdPOSColors.background.gradient }}
    >
      <MainNavigation />

      <div
        className={NerdPOSLayout.page.main}
        style={{ marginRight: "80px" }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header with Action Button */}
        <div className={NerdPOSLayout.header.wrapper}>
          <div>
            <h1
              className={NerdPOSLayout.header.title + " text-right"}
              dir="auto"
            >
              {isRTL ? "إدارة العملاء" : "Customer Management"}
            </h1>
            <p className={NerdPOSLayout.header.subtitle} dir="auto">
              {isRTL
                ? "إدارة قاعدة بيانات العملاء وبرنامج الولاء"
                : "Manage customer database and loyalty program"}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={
              NerdPOSStyles.button.primary +
              " h-12 px-6 flex items-center gap-2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_2px_6px_2px_rgba(0,0,0,0.15)]"
            }
          >
            <Plus className="w-5 h-5" />
            <span dir="auto">{isRTL ? "عميل جديد" : "New Customer"}</span>
          </motion.button>
        </div>

        {/* Stats Cards - Matching POS design */}
        {stats && (
          <div className={NerdPOSLayout.stats.grid + " lg:grid-cols-4"}>
            {/* Total Customers */}
            <div className={NerdPOSStyles.statsCard.base + " text-center"}>
              <div className="text-4xl font-['Inter'] font-bold text-[#e2e2e6] mb-2">
                {stats.totalCustomers}
              </div>
              <div
                className="text-sm font-['Almarai'] text-[#c2c7ce]"
                dir="auto"
              >
                {isRTL ? "إجمالي العملاء" : "Total Customers"}
              </div>
            </div>

            {/* Active Customers */}
            <div className={NerdPOSStyles.statsCard.base + " text-center"}>
              <div className="text-4xl font-['Inter'] font-bold text-[#e2e2e6] mb-2">
                {stats.activeCustomers}
              </div>
              <div
                className="text-sm font-['Almarai'] text-[#c2c7ce]"
                dir="auto"
              >
                {isRTL ? "النشطين" : "Active"}
              </div>
            </div>

            {/* VIP */}
            <div className={NerdPOSStyles.statsCard.base + " text-center"}>
              <div className="text-4xl font-['Inter'] font-bold text-[#e2e2e6] mb-2">
                {stats.vipCustomers}
              </div>
              <div
                className="text-sm font-['Almarai'] text-[#c2c7ce]"
                dir="auto"
              >
                VIP
              </div>
            </div>

            {/* Average Orders */}
            <div className={NerdPOSStyles.statsCard.base + " text-center"}>
              <div className="text-4xl font-['Inter'] font-bold text-[#e2e2e6] mb-2">
                {stats.averageOrders?.toFixed(1) || "0.0"}
              </div>
              <div
                className="text-sm font-['Almarai'] text-[#c2c7ce]"
                dir="auto"
              >
                {isRTL ? "متوسط الطلبات" : "Avg Orders"}
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters - Matching POS design */}
        <div className={NerdPOSLayout.filters.container}>
          {/* Search */}
          <div className={NerdPOSLayout.filters.searchWrapper}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL ? "ابحث عن عميل..." : "Search customer..."}
              className={NerdPOSStyles.input.search}
              style={{ textAlign: isRTL ? "right" : "left" }}
              dir={isRTL ? "rtl" : "ltr"}
            />
            <Search
              className="absolute w-5 h-5 text-[#c2c7ce] top-3.5"
              style={{ [isRTL ? "right" : "left"]: "16px" }}
            />
          </div>

          {/* Tier Filter Dropdown */}
          <div className="relative group">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value as any)}
              className={NerdPOSLayout.filters.select + " h-12 min-w-[200px]"}
              style={{ textAlign: isRTL ? "right" : "left" }}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <option value="all">
                {isRTL ? "جميع المستويات" : "All Tiers"}
              </option>
              <option value="bronze">{isRTL ? "برونزي" : "Bronze"}</option>
              <option value="silver">{isRTL ? "فضي" : "Silver"}</option>
              <option value="gold">{isRTL ? "ذهبي" : "Gold"}</option>
              <option value="platinum">{isRTL ? "بلاتيني" : "Platinum"}</option>
            </select>
          </div>
        </div>

        {/* Customers Grid - Matching POS product grid layout */}
        {filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center mb-4">
              <Users className="w-12 h-12 text-[#c2c7ce] opacity-50" />
            </div>
            <h3
              className="text-xl font-['Almarai'] text-[#e2e2e6] mb-2"
              dir="auto"
            >
              {isRTL ? "لا توجد نتائج" : "No Results"}
            </h3>
            <p className="text-base text-[#c2c7ce]" dir="auto">
              {isRTL
                ? "لم يتم العثور على عملاء مطابقين"
                : "No matching customers found"}
            </p>
          </div>
        ) : (
          <div
            className={
              NerdPOSLayout.data.grid +
              " grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            }
          >
            {filteredCustomers.map((customer, index) => {
              const program = getLoyaltyProgram(customer.loyaltyTier);
              const isVIP =
                customer.loyaltyTier === "gold" ||
                customer.loyaltyTier === "platinum";

              return (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.03 }}
                  className={
                    NerdPOSStyles.card.base +
                    " " +
                    NerdPOSStyles.card.hover +
                    " p-4 cursor-pointer"
                  }
                  style={{ textAlign: isRTL ? "right" : "left" }}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {/* Header: Name + Avatar */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3
                        className="text-base font-['Almarai'] font-bold text-[#e2e2e6] mb-2 line-clamp-1"
                        dir="auto"
                      >
                        {customer.name}
                      </h3>
                      <button className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                        <Star className="w-4 h-4 text-[#c2c7ce]" />
                      </button>
                    </div>

                    {/* Avatar Circle */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-['Almarai'] text-lg font-bold flex-shrink-0"
                      style={{
                        backgroundColor: isVIP
                          ? customer.loyaltyTier === "platinum"
                            ? "#E5E4E2"
                            : "#FFD700"
                          : "#ffffff",
                        color: isVIP ? "#1a1c1e" : "#1a1c1e",
                      }}
                    >
                      {customer.name.charAt(0)}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-[#c2c7ce] flex-shrink-0" />
                      <span className="font-['Inter'] text-[#e2e2e6] truncate">
                        {customer.phone}
                      </span>
                    </div>
                    {customer.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-[#c2c7ce] flex-shrink-0" />
                        <span className="font-['Inter'] text-[#e2e2e6] truncate">
                          {customer.email}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Stats Row - Matching POS design */}
                  <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.1)]">
                    <div className="flex items-center gap-1.5">
                      <Award
                        className="w-4 h-4"
                        style={{ color: program?.color || "#FFD700" }}
                      />
                      <span
                        className="text-sm font-['Inter'] font-bold"
                        style={{ color: program?.color || "#FFD700" }}
                      >
                        {customer.loyaltyPoints}
                      </span>
                      <span
                        className="text-xs font-['Almarai'] text-[#c2c7ce]"
                        dir="auto"
                      >
                        {isRTL ? "نقطة" : "pts"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-['Inter'] font-bold text-[#e2e2e6]">
                        {customer.totalOrders}
                      </span>
                      <span
                        className="text-xs font-['Almarai'] text-[#c2c7ce]"
                        dir="auto"
                      >
                        {isRTL ? "طلب" : "orders"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
