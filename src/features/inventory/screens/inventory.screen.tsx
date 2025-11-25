import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { InventoryService } from "../services/inventory.service";
import type {
  Product,
  Category,
  Warehouse,
  StockAlert,
  InventoryStats,
  InventoryFilter,
} from "../types/inventory.types";
import { MainNavigation } from "../../../components/main-navigation";
import { LoadingState } from "../../../components/loading-state";
import { StockAlertCard } from "../components/stock-alert-card";
import { ProductDetailModal } from "../components/product-detail-modal";
import { StockAdjustmentModal } from "../components/stock-adjustment-modal";
import { WarehouseModal } from "../components/warehouse-modal";
import { WarehouseListModal } from "../components/warehouse-list-modal";
import { StockTransferModal } from "../components/stock-transfer-modal";
import { ProductFormModal } from "../components/product-form-modal";
import {
  Search,
  X,
  Package,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Warehouse as WarehouseIcon,
  Filter,
  Download,
  Upload,
  Plus,
  BarChart3,
  Eye,
  Edit,
  PackageX,
  PackageCheck,
  PackageMinus,
  RefreshCw,
  ArrowRightLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  NerdPOSLayout,
  NerdPOSStyles,
  NerdPOSColors,
} from "../../../core/theme/nerdpos-styles";

export default function InventoryScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ============================================================
  // STATE MANAGEMENT
  // ============================================================

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>("all");
  const [showAlerts, setShowAlerts] = useState(false);

  // UI State
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Modals State
  const [productDetailModalOpen, setProductDetailModalOpen] = useState(false);
  const [stockAdjustmentModalOpen, setStockAdjustmentModalOpen] =
    useState(false);
  const [warehouseModalOpen, setWarehouseModalOpen] = useState(false);
  const [warehouseListModalOpen, setWarehouseListModalOpen] = useState(false);
  const [stockTransferModalOpen, setStockTransferModalOpen] = useState(false);
  const [productFormModalOpen, setProductFormModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(
    null
  );

  // ============================================================
  // DATA LOADING
  // ============================================================

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedWarehouse, selectedStockStatus, searchQuery]);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const loadData = async () => {
    setLoading(true);
    try {
      const filter: InventoryFilter = {
        search: searchQuery || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        warehouse: selectedWarehouse !== "all" ? selectedWarehouse : undefined,
        stockStatus:
          selectedStockStatus !== "all"
            ? (selectedStockStatus as any)
            : undefined,
      };

      const [
        productsData,
        categoriesData,
        warehousesData,
        alertsData,
        statsData,
      ] = await Promise.all([
        InventoryService.getProducts(filter),
        InventoryService.getCategories(),
        InventoryService.getWarehouses(),
        InventoryService.getStockAlerts(),
        InventoryService.getInventoryStats(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setWarehouses(warehousesData);
      setAlerts(alertsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading inventory data:", error);
      showFeedback("حدث خطأ في تحميل البيانات", "error");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      setFeedback({ message, type });
    },
    []
  );

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await InventoryService.acknowledgeAlert(alertId);
      setAlerts(
        alerts.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
      );
      showFeedback("تم وضع علامة على التنبيه", "success");
    } catch (error) {
      showFeedback("فشل تحديث التنبيه", "error");
    }
  };

  const getTotalStock = (product: Product): number => {
    return product.warehouses.reduce((sum, w) => sum + w.quantity, 0);
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "text-green-400";
      case "low-stock":
        return "text-orange-400";
      case "out-of-stock":
        return "text-red-400";
      default:
        return "text-[#c2c7ce]";
    }
  };

  const getStockStatusLabel = (status: string) => {
    switch (status) {
      case "in-stock":
        return "متوفر";
      case "low-stock":
        return "منخفض";
      case "out-of-stock":
        return "نفذ";
      default:
        return "";
    }
  };

  const getStockStatusIcon = (status: string) => {
    switch (status) {
      case "in-stock":
        return <PackageCheck className="w-4 h-4" />;
      case "low-stock":
        return <PackageMinus className="w-4 h-4" />;
      case "out-of-stock":
        return <PackageX className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setProductDetailModalOpen(true);
  };

  const handleStockAdjustment = (product: Product) => {
    setSelectedProduct(product);
    setStockAdjustmentModalOpen(true);
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleOpenWarehouseModal = () => {
    setWarehouseModalOpen(true);
  };

  const handleOpenWarehouseListModal = () => {
    setWarehouseListModalOpen(true);
  };

  const handleOpenStockTransferModal = (warehouseId: string) => {
    setSelectedWarehouseId(warehouseId);
    setStockTransferModalOpen(true);
  };

  const handleOpenProductFormModal = () => {
    setProductFormModalOpen(true);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className={NerdPOSLayout.page.container}
      style={{
        background: NerdPOSColors.background.gradient,
        paddingRight: "80px",
      }}
      dir="rtl"
    >
      {/* Navigation */}
      <MainNavigation />

      {/* Feedback Toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div
              className={`px-6 py-3 rounded-xl shadow-lg backdrop-blur-md ${
                feedback.type === "success"
                  ? "bg-green-500/90 text-white"
                  : feedback.type === "error"
                  ? "bg-red-500/90 text-white"
                  : "bg-cyan-400/90 text-[#00373a]"
              }`}
            >
              <p className="font-['Almarai'] font-bold" dir="auto">
                {feedback.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={NerdPOSLayout.page.content}>
        {/* Header Section */}
        <div className={NerdPOSLayout.header.container}>
          {/* Title */}
          <div className={NerdPOSLayout.header.wrapper}>
            <div>
              <h1 className={NerdPOSLayout.header.title}>إدارة المخزون</h1>
              <p className={NerdPOSLayout.header.subtitle}>
                تتبع وإدارة مخزون المنتجات
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="relative px-4 py-2 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] hover:border-cyan-400/50 transition-all"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-['Almarai']">التنبيهات</span>
                  {stats && stats.alerts > 0 && (
                    <span className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-['Arial'] font-bold text-white">
                      {stats.alerts}
                    </span>
                  )}
                </div>
              </button>
              <button className="px-4 py-2 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] hover:border-cyan-400/50 transition-all">
                <Download className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] hover:border-cyan-400/50 transition-all">
                <Upload className="w-5 h-5" />
              </button>
              <button
                onClick={handleOpenWarehouseListModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-b from-purple-400 to-purple-600 text-white hover:opacity-90 shadow-lg transition-all"
              >
                <div className="flex items-center gap-2">
                  <WarehouseIcon className="w-5 h-5" />
                  <span className="font-['Almarai'] font-bold">المستودعات</span>
                </div>
              </button>
              <button
                onClick={handleOpenProductFormModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-b from-[#22d3ee] to-[#006399] text-[#00373a] hover:opacity-90 shadow-lg transition-all"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  <span className="font-['Almarai'] font-bold">منتج جديد</span>
                </div>
              </button>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] hover:border-cyan-400/50 transition-all"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className={NerdPOSLayout.stats.grid}>
              <div
                className={`${NerdPOSLayout.stats.card} bg-gradient-to-br from-[rgba(34,211,238,0.1)] to-[rgba(0,99,153,0.05)] border-cyan-400/20`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                    إجمالي المنتجات
                  </span>
                </div>
                <p className="text-2xl font-['Arial'] font-bold text-cyan-400 text-right">
                  {stats.totalProducts}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(16,185,129,0.1)] to-[rgba(5,150,105,0.05)] border border-green-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <PackageCheck className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                    متوفر
                  </span>
                </div>
                <p className="text-2xl font-['Arial'] font-bold text-green-400 text-right">
                  {stats.inStock}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(245,158,11,0.1)] to-[rgba(217,119,6,0.05)] border border-orange-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <PackageMinus className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                    منخفض
                  </span>
                </div>
                <p className="text-2xl font-['Arial'] font-bold text-orange-400 text-right">
                  {stats.lowStock}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(239,68,68,0.1)] to-[rgba(220,38,38,0.05)] border border-red-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <PackageX className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                    نفذ
                  </span>
                </div>
                <p className="text-2xl font-['Arial'] font-bold text-red-400 text-right">
                  {stats.outOfStock}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(139,92,246,0.1)] to-[rgba(124,58,237,0.05)] border border-purple-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <WarehouseIcon className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                    المستودعات
                  </span>
                </div>
                <p className="text-2xl font-['Arial'] font-bold text-purple-400 text-right">
                  {stats.warehouses}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(34,211,238,0.1)] to-[rgba(0,99,153,0.05)] border border-cyan-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                    قيمة المخزون
                  </span>
                </div>
                <p className="text-xl font-['Arial'] font-bold text-cyan-400 text-right">
                  {stats.totalValue.toLocaleString("ar-SA", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  ر.س
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(34,211,238,0.1)] to-[rgba(0,99,153,0.05)] border border-cyan-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                    التكلفة
                  </span>
                </div>
                <p className="text-xl font-['Arial'] font-bold text-cyan-400 text-right">
                  {stats.totalCost.toLocaleString("ar-SA", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  ر.س
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(239,68,68,0.1)] to-[rgba(220,38,38,0.05)] border border-red-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                    تنبيهات
                  </span>
                </div>
                <p className="text-2xl font-['Arial'] font-bold text-red-400 text-right">
                  {stats.alerts}
                </p>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className={NerdPOSLayout.filters.container}>
            {/* Search */}
            <div className={NerdPOSLayout.filters.searchWrapper}>
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#c2c7ce]" />
              <input
                type="text"
                placeholder="ابحث بالاسم، الباركود، أو رمز المنتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={
                  NerdPOSStyles.input.base + " w-full pr-12 pl-12 py-3"
                }
                dir="rtl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#c2c7ce] hover:text-[#e2e2e6]"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={NerdPOSLayout.filters.select}
              dir="rtl"
            >
              <option value="all">كل الفئات</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.productCount})
                </option>
              ))}
            </select>

            {/* Warehouse Filter */}
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className={NerdPOSLayout.filters.select}
              dir="rtl"
            >
              <option value="all">كل المستودعات</option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name}
                </option>
              ))}
            </select>

            {/* Stock Status Filter */}
            <select
              value={selectedStockStatus}
              onChange={(e) => setSelectedStockStatus(e.target.value)}
              className={NerdPOSLayout.filters.select}
              dir="rtl"
            >
              <option value="all">كل الحالات</option>
              <option value="in-stock">متوفر</option>
              <option value="low-stock">منخفض</option>
              <option value="out-of-stock">نفذ</option>
            </select>
          </div>
        </div>

        {/* Alerts Panel */}
        <AnimatePresence>
          {showAlerts && alerts.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-[rgba(255,255,255,0.1)] overflow-hidden"
            >
              <div className="px-6 py-4 bg-[rgba(239,68,68,0.05)]">
                <h3 className="text-lg font-['Almarai'] font-bold text-[#e2e2e6] mb-3">
                  التنبيهات النشطة (
                  {alerts.filter((a) => !a.acknowledged).length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {alerts.slice(0, 6).map((alert) => (
                    <StockAlertCard
                      key={alert.id}
                      alert={alert}
                      onAcknowledge={handleAcknowledgeAlert}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Table */}
        <div className={NerdPOSLayout.page.main}>
          <LoadingState loading={loading}>
            {products.length > 0 ? (
              <div className={NerdPOSLayout.data.tableContainer}>
                <table className="w-full">
                  <thead className={NerdPOSLayout.data.tableHeader}>
                    <tr>
                      <th className="px-4 py-3 text-right text-sm font-['Almarai'] font-bold text-[#e2e2e6]">
                        المنتج
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-[#e2e2e6]">
                        رمز المنتج
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-[#e2e2e6]">
                        الفئة
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-[#e2e2e6]">
                        الكمية
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-[#e2e2e6]">
                        الحالة
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-[#e2e2e6]">
                        السعر
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-[#e2e2e6]">
                        التكلفة
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-[#e2e2e6]">
                        المستودعات
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-[#e2e2e6]">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={NerdPOSLayout.data.tr}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                              <Package className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                              <p className="font-['Almarai'] font-bold text-[#e2e2e6] text-right">
                                {product.name}
                              </p>
                              {product.nameEn && (
                                <p className="text-xs text-[#c2c7ce] text-right">
                                  {product.nameEn}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-sm font-['Arial'] text-[#c2c7ce]">
                            {product.sku}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-sm font-['Almarai'] text-[#c2c7ce]">
                            {product.category.name}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div>
                            <span className="text-lg font-['Arial'] font-bold text-[#e2e2e6]">
                              {getTotalStock(product)}
                            </span>
                            <span className="text-xs font-['Almarai'] text-[#c2c7ce] mr-1">
                              {product.unit}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg ${getStockStatusColor(
                              product.stockStatus
                            )} bg-[rgba(255,255,255,0.05)]`}
                          >
                            {getStockStatusIcon(product.stockStatus)}
                            <span className="text-sm font-['Almarai'] font-bold">
                              {getStockStatusLabel(product.stockStatus)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="font-['Arial'] font-bold text-cyan-400">
                            {product.price.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="font-['Arial'] text-[#c2c7ce]">
                            {product.cost.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-sm font-['Arial'] text-[#c2c7ce]">
                            {product.warehouses.length}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                              title="عرض"
                              onClick={() => handleProductDetail(product)}
                            >
                              <Eye className="w-4 h-4 text-[#c2c7ce]" />
                            </button>
                            <button
                              className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                              title="تعديل"
                            >
                              <Edit className="w-4 h-4 text-[#c2c7ce]" />
                            </button>
                            <button
                              className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                              title="تعديل المخزون"
                              onClick={() => handleStockAdjustment(product)}
                            >
                              <PackageCheck className="w-4 h-4 text-[#c2c7ce]" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Package className="w-16 h-16 text-[#c2c7ce] opacity-50 mx-auto mb-4" />
                  <p className="text-[#c2c7ce] font-['Almarai']">
                    لا توجد منتجات
                  </p>
                </div>
              </div>
            )}
          </LoadingState>
        </div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {productDetailModalOpen && selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => {
              setProductDetailModalOpen(false);
              setSelectedProduct(null);
            }}
            onEdit={() => {
              setProductDetailModalOpen(false);
              showFeedback("تحرير المنتج قريباً", "info");
            }}
            onAdjustStock={async (warehouseId, quantity, type) => {
              showFeedback("تم تعديل المخزون بنجاح", "success");
              await loadData();
            }}
          />
        )}
      </AnimatePresence>

      {/* Stock Adjustment Modal */}
      <AnimatePresence>
        {stockAdjustmentModalOpen && selectedProduct && (
          <StockAdjustmentModal
            product={selectedProduct}
            warehouses={warehouses}
            onClose={() => {
              setStockAdjustmentModalOpen(false);
              setSelectedProduct(null);
            }}
            onAdjust={async (adjustment) => {
              // Here you would call the API to adjust stock
              showFeedback("تم تعديل المخزون بنجاح", "success");
              await loadData();
            }}
          />
        )}
      </AnimatePresence>

      {/* Warehouse Modal */}
      <AnimatePresence>
        {warehouseModalOpen && (
          <WarehouseModal
            isOpen={warehouseModalOpen}
            onClose={() => {
              setWarehouseModalOpen(false);
              loadData();
            }}
            onSave={async (warehouse) => {
              try {
                if (warehouse.id) {
                  await InventoryService.updateWarehouse(warehouse);
                  showFeedback("تم تحديث المستودع بنجاح", "success");
                } else {
                  await InventoryService.createWarehouse(warehouse);
                  showFeedback("تم إضافة المستودع بنجاح", "success");
                }
                await loadData();
              } catch (error) {
                showFeedback("فشل حفظ المستودع", "error");
              }
            }}
            onDelete={async (warehouseId) => {
              try {
                await InventoryService.deleteWarehouse(warehouseId);
                showFeedback("تم حذف المستودع بنجاح", "success");
                await loadData();
              } catch (error) {
                showFeedback("فشل حذف المستودع", "error");
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Warehouse List Modal */}
      <AnimatePresence>
        {warehouseListModalOpen && (
          <WarehouseListModal
            isOpen={warehouseListModalOpen}
            warehouses={warehouses}
            onClose={() => {
              setWarehouseListModalOpen(false);
              loadData();
            }}
            onAddWarehouse={() => {
              setWarehouseListModalOpen(false);
              setWarehouseModalOpen(true);
            }}
            onEditWarehouse={(warehouse) => {
              setWarehouseListModalOpen(false);
              setSelectedWarehouseId(warehouse.id);
              setWarehouseModalOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Stock Transfer Modal */}
      <AnimatePresence>
        {stockTransferModalOpen && selectedProduct && (
          <StockTransferModal
            isOpen={stockTransferModalOpen}
            product={selectedProduct}
            warehouses={warehouses}
            onClose={() => {
              setStockTransferModalOpen(false);
              setSelectedProduct(null);
            }}
            onTransfer={async (
              productId,
              fromWarehouseId,
              toWarehouseId,
              quantity,
              notes
            ) => {
              try {
                await InventoryService.transferStockWithNotes(
                  productId,
                  fromWarehouseId,
                  toWarehouseId,
                  quantity,
                  notes
                );
                showFeedback("تم نقل المخزون بنجاح", "success");
                await loadData();
              } catch (error) {
                showFeedback("فشل نقل المخزون", "error");
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Product Form Modal */}
      <AnimatePresence>
        {productFormModalOpen && (
          <ProductFormModal
            isOpen={productFormModalOpen}
            product={selectedProduct}
            categories={categories}
            warehouses={warehouses}
            suppliers={[]}
            onClose={() => {
              setProductFormModalOpen(false);
              setSelectedProduct(null);
              loadData();
            }}
            onSave={async (product) => {
              try {
                if (product.id) {
                  await InventoryService.updateProduct(product);
                  showFeedback("تم تحديث المنتج بنجاح", "success");
                } else {
                  await InventoryService.createProduct(product);
                  showFeedback("تم إضافة المنتج بنجاح", "success");
                }
                await loadData();
              } catch (error) {
                showFeedback("فشل حفظ المنتج", "error");
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
