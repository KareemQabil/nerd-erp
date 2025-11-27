import { useState, useEffect, useCallback } from "react";

import { InventoryService } from "../services/inventory.service";
import type {
  Product,
  Category,
  Warehouse,
  StockAlert,
  InventoryStats,
  InventoryFilter,
} from "../types/inventory.types";

import { LoadingState } from "../../../components/loading-state";
import { StockAlertCard } from "../components/stock-alert-card";
import { ProductDetailModal } from "../components/product-detail-modal";
import { StockAdjustmentModal } from "../components/stock-adjustment-modal";
import { WarehouseModal } from "../components/warehouse-modal";
import { WarehouseListModal } from "../components/warehouse-list-modal";
import { StockTransferModal } from "../components/stock-transfer-modal";
import { ProductFormModal } from "../components/product-form-modal";
import {
  Package,
  Search,
  Plus,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  PackageCheck,
  PackageX,
  PackageMinus,
  Eye,
  Edit,
  Warehouse as WarehouseIcon,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  NerdPOSLayout,
  NerdPOSStyles,
} from "../../../core/theme/nerdpos-styles";
import { CustomDropdown } from "@/components/ui/custom-dropdown";

export default function InventoryScreen() {
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

  // ============================================================
  // DATA LOADING
  // ============================================================

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            ? (selectedStockStatus as InventoryFilter["stockStatus"])
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
    } catch {
      showFeedback("فشل تحديث التنبيه", "error");
    }
  };

  const getTotalStock = (product: Product): number => {
    return product.warehouses.reduce((sum, w) => sum + w.quantity, 0);
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "text-success";
      case "low-stock":
        return "text-warning";
      case "out-of-stock":
        return "text-error";
      default:
        return "text-text-secondary";
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

  const handleOpenWarehouseListModal = () => {
    setWarehouseListModalOpen(true);
  };

  const handleOpenProductFormModal = () => {
    setProductFormModalOpen(true);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
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
                  : "bg-cyan-400/90 text-on-primary"
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
                className="relative px-4 py-2 rounded-xl bg-surface-overlay border border-border-subtle text-text-primary hover:border-primary/50 transition-all"
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
              <button className="px-4 py-2 rounded-xl bg-surface-overlay border border-border-subtle text-text-primary hover:border-primary/50 transition-all">
                <Download className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 rounded-xl bg-surface-overlay border border-border-subtle text-text-primary hover:border-primary/50 transition-all">
                <Upload className="w-5 h-5" />
              </button>
              <button
                onClick={handleOpenWarehouseListModal}
                className="px-4 py-2 rounded-xl bg-linear-to-b from-purple-400 to-purple-600 text-white hover:opacity-90 shadow-lg transition-all"
              >
                <div className="flex items-center gap-2">
                  <WarehouseIcon className="w-5 h-5" />
                  <span className="font-['Almarai'] font-bold">المستودعات</span>
                </div>
              </button>
              <button
                onClick={handleOpenProductFormModal}
                className="px-4 py-2 rounded-xl bg-linear-to-b from-[#22d3ee] to-[#006399] text-on-primary hover:opacity-90 shadow-lg transition-all"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  <span className="font-['Almarai'] font-bold">منتج جديد</span>
                </div>
              </button>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 rounded-xl bg-surface-overlay border border-border-subtle text-text-primary hover:border-primary/50 transition-all"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className={NerdPOSLayout.stats.grid + " lg:grid-cols-8"}>
              <div
                className={`${NerdPOSLayout.stats.card} bg-linear-to-br from-[rgba(34,211,238,0.1)] to-[rgba(0,99,153,0.05)] border-primary/20`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-primary" />
                  <span className="text-xs font-['Almarai'] text-text-secondary">
                    إجمالي المنتجات
                  </span>
                </div>
                <p className="text-2xl font-['Arial'] font-bold text-primary text-right">
                  {stats.totalProducts}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-linear-to-br from-[rgba(16,185,129,0.1)] to-[rgba(5,150,105,0.05)] border border-success/20">
                <div className="flex items-center gap-2 mb-2">
                  <PackageCheck className="w-4 h-4 text-success" />
                  <span className="text-xs font-['Almarai'] text-text-secondary">
                    متوفر
                  </span>
                </div>
                <p className="text-2xl font-['Arial'] font-bold text-success text-right">
                  {stats.inStock}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-linear-to-br from-[rgba(245,158,11,0.1)] to-[rgba(217,119,6,0.05)] border border-warning/20">
                <div className="flex items-center gap-2 mb-2">
                  <PackageMinus className="w-4 h-4 text-warning" />
                  <span className="text-xs font-['Almarai'] text-text-secondary">
                    منخفض
                  </span>
                </div>
                <p className="text-2xl font-['Arial'] font-bold text-warning text-right">
                  {stats.lowStock}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-linear-to-br from-[rgba(239,68,68,0.1)] to-[rgba(220,38,38,0.05)] border border-error/20">
                <div className="flex items-center gap-2 mb-2">
                  <PackageX className="w-4 h-4 text-error" />
                  <span className="text-xs font-['Almarai'] text-text-secondary">
                    نفذ
                  </span>
                </div>
                <p className="text-2xl font-['Arial'] font-bold text-error text-right">
                  {stats.outOfStock}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-linear-to-br from-[rgba(139,92,246,0.1)] to-[rgba(124,58,237,0.05)] border border-purple-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <WarehouseIcon className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-['Almarai'] text-text-secondary">
                    المستودعات
                  </span>
                </div>
                <p className="text-2xl font-['Arial'] font-bold text-purple-400 text-right">
                  {stats.warehouses}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-linear-to-br from-[rgba(34,211,238,0.1)] to-[rgba(0,99,153,0.05)] border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs font-['Almarai'] text-text-secondary">
                    قيمة المخزون
                  </span>
                </div>
                <p className="text-xl font-['Arial'] font-bold text-primary text-right">
                  {stats.totalValue.toLocaleString("ar-SA", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  ر.س
                </p>
              </div>

              <div className="p-4 rounded-xl bg-linear-to-br from-[rgba(34,211,238,0.1)] to-[rgba(0,99,153,0.05)] border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-primary" />
                  <span className="text-xs font-['Almarai'] text-text-secondary">
                    التكلفة
                  </span>
                </div>
                <p className="text-xl font-['Arial'] font-bold text-primary text-right">
                  {stats.totalCost.toLocaleString("ar-SA", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  ر.س
                </p>
              </div>

              <div className="p-4 rounded-xl bg-linear-to-br from-[rgba(239,68,68,0.1)] to-[rgba(220,38,38,0.05)] border border-error/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-error" />
                  <span className="text-xs font-['Almarai'] text-text-secondary">
                    تنبيهات
                  </span>
                </div>
                <p className="text-2xl font-['Arial'] font-bold text-error text-right">
                  {stats.alerts}
                </p>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className={NerdPOSLayout.filters.container}>
            {/* Search */}
            <div className={NerdPOSLayout.filters.searchWrapper}>
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
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
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <CustomDropdown
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={[
                { value: "all", label: "كل الفئات" },
                ...categories.map((cat) => ({
                  value: cat.id,
                  label: `${cat.name} (${cat.productCount})`,
                })),
              ]}
              placeholder="كل الفئات"
              className="w-[180px]"
            />

            {/* Warehouse Filter */}
            <CustomDropdown
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              options={[
                { value: "all", label: "كل المستودعات" },
                ...warehouses.map((wh) => ({
                  value: wh.id,
                  label: wh.name,
                })),
              ]}
              placeholder="كل المستودعات"
              className="w-[180px]"
            />

            {/* Stock Status Filter */}
            <CustomDropdown
              value={selectedStockStatus}
              onChange={setSelectedStockStatus}
              options={[
                { value: "all", label: "كل الحالات" },
                { value: "in-stock", label: "متوفر" },
                { value: "low-stock", label: "منخفض" },
                { value: "out-of-stock", label: "نفذ" },
              ]}
              placeholder="كل الحالات"
              className="w-[180px]"
            />
          </div>
        </div>

        {/* Alerts Panel */}
        <AnimatePresence>
          {showAlerts && alerts.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-border-subtle overflow-hidden"
            >
              <div className="px-6 py-4 bg-[rgba(239,68,68,0.05)]">
                <h3 className="text-lg font-['Almarai'] font-bold text-text-primary mb-3">
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
                      <th className="px-4 py-3 text-right text-sm font-['Almarai'] font-bold text-text-primary">
                        المنتج
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-text-primary">
                        رمز المنتج
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-text-primary">
                        الفئة
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-text-primary">
                        الكمية
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-text-primary">
                        الحالة
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-text-primary">
                        السعر
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-text-primary">
                        التكلفة
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-text-primary">
                        المستودعات
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-['Almarai'] font-bold text-text-primary">
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
                            <div className="w-12 h-12 rounded-lg bg-surface-overlay flex items-center justify-center">
                              <Package className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-['Almarai'] font-bold text-text-primary text-right">
                                {product.name}
                              </p>
                              {product.nameEn && (
                                <p className="text-xs text-text-secondary text-right">
                                  {product.nameEn}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-sm font-['Arial'] text-text-secondary">
                            {product.sku}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-sm font-['Almarai'] text-text-secondary">
                            {product.category.name}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div>
                            <span className="text-lg font-['Arial'] font-bold text-text-primary">
                              {getTotalStock(product)}
                            </span>
                            <span className="text-xs font-['Almarai'] text-text-secondary mr-1">
                              {product.unit}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg ${getStockStatusColor(
                              product.stockStatus
                            )} bg-surface-overlay`}
                          >
                            {getStockStatusIcon(product.stockStatus)}
                            <span className="text-sm font-['Almarai'] font-bold">
                              {getStockStatusLabel(product.stockStatus)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="font-['Arial'] font-bold text-primary">
                            {product.price.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="font-['Arial'] text-text-secondary">
                            {product.cost.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-sm font-['Arial'] text-text-secondary">
                            {product.warehouses.length}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="p-2 rounded-lg bg-surface-overlay hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                              title="عرض"
                              onClick={() => handleProductDetail(product)}
                            >
                              <Eye className="w-4 h-4 text-text-secondary" />
                            </button>
                            <button
                              className="p-2 rounded-lg bg-surface-overlay hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                              title="تعديل"
                            >
                              <Edit className="w-4 h-4 text-text-secondary" />
                            </button>
                            <button
                              className="p-2 rounded-lg bg-surface-overlay hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                              title="تعديل المخزون"
                              onClick={() => handleStockAdjustment(product)}
                            >
                              <PackageCheck className="w-4 h-4 text-text-secondary" />
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
                  <Package className="w-16 h-16 text-text-secondary opacity-50 mx-auto mb-4" />
                  <p className="text-text-secondary font-['Almarai']">
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
            onAdjustStock={async () => {
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
            onAdjust={async () => {
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
              } catch {
                showFeedback("فشل حفظ المستودع", "error");
              }
            }}
            onDelete={async (warehouseId) => {
              try {
                await InventoryService.deleteWarehouse(warehouseId);
                showFeedback("تم حذف المستودع بنجاح", "success");
                await loadData();
              } catch {
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
            onEditWarehouse={() => {
              setWarehouseListModalOpen(false);
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
              } catch {
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
              } catch {
                showFeedback("فشل حفظ المنتج", "error");
              }
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
