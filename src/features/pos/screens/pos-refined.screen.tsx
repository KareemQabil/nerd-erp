import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../core/auth/auth.context";
import {
  POSService,
  CustomerService,
  HeldOrderService,
} from "../services/pos.service";
import { PrintService } from "../services/print.service";
import { SyncService } from "../../../core/services/sync.service";
import type {
  Product,
  Category,
  CartItem,
  OrderType,
  PaymentMethod,
  Table,
  Discount,
  Customer,
} from "../types/pos.types";
import { LoadingState } from "../../../components/loading-state";
import { MainNavigation } from "../../../components/main-navigation";
import { POSActionBar } from "../components/pos-action-bar";
import { CartPanel } from "../components/cart-panel";
import { PaymentModalRedesigned } from "../components/payment-modal-redesigned";
import { ReceiptPreviewModal } from "../components/receipt-preview-modal";
import { KitchenSendModal } from "../components/kitchen-send-modal";
import { TableSelectorModal } from "../components/table-selector-modal-new";
import { DiscountModal } from "../components/discount-modal";
import { HoldOrdersModal } from "../components/hold-orders-modal";
import { CustomerSelectorModal } from "../components/customer-selector-modal";
import { BarcodeScannerModal } from "../components/barcode-scanner-modal";
import { ProductModifiersModal } from "../components/product-modifiers-modal";
import { ReturnsModal } from "../components/returns-modal";
import { Search, ChevronDown, Zap, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// HeldOrder interface
interface HeldOrder {
  id: string;
  orderNumber: string;
  timestamp: Date;
  itemsCount: number;
  total: number;
  customerName?: string;
  items: CartItem[];
  orderType: "takeaway" | "dineIn" | "delivery";
  selectedTable?: Table;
  appliedDiscount?: { discount: Discount; value: number };
}

export default function POSRefinedScreen() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Data State
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("takeaway");
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [appliedDiscount, setAppliedDiscount] = useState<{
    discount: Discount;
    value: number;
  } | null>(null);

  // UI State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptPreviewOpen, setIsReceiptPreviewOpen] = useState(false);
  const [isKitchenSendOpen, setIsKitchenSendOpen] = useState(false);
  const [isDrawerClosingOpen, setIsDrawerClosingOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isHoldOrdersModalOpen, setIsHoldOrdersModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isModifiersModalOpen, setIsModifiersModalOpen] = useState(false);
  const [isReturnsModalOpen, setIsReturnsModalOpen] = useState(false);
  const [selectedProductForModifiers, setSelectedProductForModifiers] =
    useState<Product | null>(null);
  const [completedPayment, setCompletedPayment] = useState<{
    method: PaymentMethod;
    amount: number;
    change?: number;
    orderNumber: string;
  } | null>(null);

  // Feedback State (subtle inline instead of toast)
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys 1-9 for category selection
      if (e.key >= "1" && e.key <= "9") {
        const index = parseInt(e.key) - 1;
        if (index < categories.length) {
          setSelectedCategory(categories[index].id);
          e.preventDefault();
        }
      }

      // Ctrl+F for search focus
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        searchInputRef.current?.focus();
        e.preventDefault();
      }

      // ESC to close modals
      if (e.key === "Escape") {
        if (isCartOpen) setIsCartOpen(false);
        else if (isPaymentModalOpen) setIsPaymentModalOpen(false);
        else if (isDiscountModalOpen) setIsDiscountModalOpen(false);
        else if (isHoldOrdersModalOpen) setIsHoldOrdersModalOpen(false);
        else if (isCustomerModalOpen) setIsCustomerModalOpen(false);
        else if (isBarcodeModalOpen) setIsBarcodeModalOpen(false);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    categories,
    isCartOpen,
    isPaymentModalOpen,
    isDiscountModalOpen,
    isHoldOrdersModalOpen,
    isCustomerModalOpen,
    isBarcodeModalOpen,
  ]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, prods, custs, holds] = await Promise.all([
        POSService.getCategories(),
        selectedCategory === "all"
          ? POSService.getProducts()
          : POSService.getProducts(selectedCategory),
        CustomerService.getCustomers(),
        HeldOrderService.getHeldOrders(),
      ]);
      setCategories(cats);
      setProducts(prods);
      setCustomers(custs);
      setHeldOrders(holds);
    } catch (error) {
      console.error("Error loading data:", error);
      showFeedback("خطأ في تحميل البيانات", "error");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setFeedback({ message, type });
  };

  // Cart Operations
  const addToCart = (product: Product) => {
    if (!product.isAvailable) {
      showFeedback("المنتج غير متوفر حالياً", "error");
      return;
    }

    // If product is customizable, show modifiers modal
    if (product.isCustomizable) {
      setSelectedProductForModifiers(product);
      setIsModifiersModalOpen(true);
      return;
    }

    const existingItem = cart.find(
      (item) => item.productId === product.id && !item.modifiers
    );
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product.id && !item.modifiers
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price,
              }
            : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${product.id}`,
        productId: product.id,
        product,
        quantity: 1,
        price: product.price,
        total: product.price,
      };
      setCart([...cart, newItem]);
    }
    showFeedback(`تمت إضافة ${product.name}`, "success");
  };

  const addToCartWithModifiers = (
    modifiers: any[],
    specialInstructions: string,
    quantity: number
  ) => {
    if (!selectedProductForModifiers) return;

    const product = selectedProductForModifiers;
    const modifiersTotal = modifiers.reduce((sum, mod) => sum + mod.price, 0);
    const itemPrice = product.price + modifiersTotal;

    const newItem: CartItem = {
      id: `cart-${Date.now()}-${product.id}-${Math.random()}`,
      productId: product.id,
      product,
      quantity,
      price: itemPrice,
      total: itemPrice * quantity,
      modifiers,
      specialInstructions,
    };

    setCart([...cart, newItem]);
    showFeedback(`تمت إضافة ${product.name} مع التخصيصات`, "success");
    setSelectedProductForModifiers(null);
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(
      cart.map((item) =>
        item.id === itemId
          ? { ...item, quantity, total: quantity * item.price }
          : item
      )
    );
  };

  const removeCartItem = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
    showFeedback("تم إزالة المتج", "info");
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    setCart([]);
    setAppliedDiscount(null);
    setSelectedTable(null);
    setSelectedCustomer(null);
    showFeedback("تم تفريغ السلة", "info");
  };

  // Calculations
  const getTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.15; // 15% VAT

    let discountAmount = 0;
    if (appliedDiscount) {
      const { discount, value } = appliedDiscount;
      if (discount.type === "percentage") {
        discountAmount = (subtotal * value) / 100;
      } else {
        discountAmount = value;
      }
    }

    const total = subtotal + tax - discountAmount;
    return {
      subtotal,
      tax,
      discount: discountAmount,
      total,
      items: cart.length,
    };
  };

  const totals = getTotals();

  // Handlers
  const handleOrderTypeChange = (type: OrderType) => {
    setOrderType(type);
    if (type === "dineIn" && !selectedTable) {
      setIsTableModalOpen(true);
    }
  };

  const handleSelectTable = (table: Table) => {
    setSelectedTable(table);
    setOrderType("dineIn");

    // 🔄 SYNC: Occupy table when selected with an order
    if (cart.length > 0) {
      const orderNumber = `TMP-${Date.now().toString().slice(-6)}`;
      SyncService.occupyTable({
        tableId: table.id,
        tableNumber: table.number,
        orderId: `ORD-${Date.now()}`,
        orderNumber,
        guestCount: 1, // Default, can be updated later
        currentBill: totals.total,
      }).catch((error) => {
        console.error("Failed to sync table occupation:", error);
      });
    }
  };

  const handleApplyDiscount = (discount: Discount, customValue?: number) => {
    const value = customValue !== undefined ? customValue : discount.value;
    setAppliedDiscount({ discount, value });
    showFeedback(`تم تطبيق خصم ${discount.name}`, "success");
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showFeedback("السلة فارغة", "error");
      return;
    }
    setIsCartOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = async (
    method: PaymentMethod,
    amount: number,
    change?: number,
    split?: any
  ) => {
    // Payment completed - show receipt preview
    const orderNumber = `INV${Date.now().toString().slice(-6)}`;
    setCompletedPayment({ method, amount, change, orderNumber });

    // Close payment modal and show receipt preview
    setIsPaymentModalOpen(false);
    setIsReceiptPreviewOpen(true);

    // 🔄 SYNC: Create order and update inventory
    try {
      await SyncService.processSale({
        id: `ORD-${Date.now()}`,
        orderNumber,
        items: cart,
        subtotal: totals.subtotal,
        tax: totals.tax,
        discount: totals.discount,
        total: totals.total,
        paymentMethod: method,
        orderType,
        customerName: selectedCustomer?.name,
        customerPhone: selectedCustomer?.phone,
        tableId: selectedTable?.id,
        tableNumber: selectedTable?.number,
        createdBy: user?.id || "USR-UNKNOWN",
        createdByName: user?.name || "كاشير",
      });
      console.log("✅ Sale synced to Orders & Inventory");
    } catch (error) {
      console.error("❌ Failed to sync sale:", error);
      showFeedback("تحذير: فشلت مزامنة البيانات", "error");
    }
  };

  // Reset cart after receipt preview closes
  const handleReceiptPreviewClose = () => {
    // 🔄 SYNC: Free table when order is completed
    if (selectedTable) {
      SyncService.freeTable(selectedTable.id, selectedTable.number).catch(
        (error) => {
          console.error("Failed to sync table release:", error);
        }
      );
    }

    setIsReceiptPreviewOpen(false);
    setCart([]);
    setAppliedDiscount(null);
    setSelectedTable(null);
    setSelectedCustomer(null);
    setCompletedPayment(null);
    showFeedback("✅ تمت العملية بنجاح", "success");
  };

  // Kitchen send handler
  const handleKitchenSendComplete = () => {
    setIsKitchenSendOpen(false);
    showFeedback("✅ تم إرسال الطلب إلى المطبخ", "success");
  };

  const handleSelectCustomer = () => {
    setIsCustomerModalOpen(true);
  };

  const handleHoldOrder = async () => {
    if (cart.length === 0) return;
    try {
      await HeldOrderService.holdOrder(
        cart,
        orderType,
        selectedTable || undefined,
        appliedDiscount || undefined,
        selectedCustomer?.name
      );
      showFeedback("تم تعليق الطلب بنجاح", "success");
      setCart([]);
      setAppliedDiscount(null);
      setSelectedTable(null);
      setSelectedCustomer(null);
      loadData(); // Refresh held orders
    } catch (error) {
      showFeedback("فشل تعليق الطلب", "error");
    }
  };

  const handleRetrieveOrder = () => {
    setIsHoldOrdersModalOpen(true);
  };

  const handleRetrieveHeldOrder = async (orderId: string) => {
    try {
      const order = await HeldOrderService.retrieveOrder(orderId);
      if (order) {
        setCart(order.items);
        setOrderType(order.orderType);
        setSelectedTable(order.selectedTable || null);
        setAppliedDiscount(order.appliedDiscount || null);
        showFeedback(`تم استعادة الطلب #${order.orderNumber}`, "success");
        setIsHoldOrdersModalOpen(false);
        loadData();
      }
    } catch (error) {
      showFeedback("فشل استعادة الطلب", "error");
    }
  };

  const handleDeleteHeldOrder = async (orderId: string) => {
    try {
      await HeldOrderService.deleteHeldOrder(orderId);
      showFeedback("تم حذف الطلب المعلق", "info");
      loadData();
    } catch (error) {
      showFeedback("فشل حذف الطلب", "error");
    }
  };

  const handlePrintReceipt = async () => {
    if (cart.length === 0) return;

    try {
      const orderNumber = `INV${Date.now().toString().slice(-6)}`;

      const printed = await PrintService.printReceipt({
        orderNumber,
        timestamp: new Date(),
        cashier: user?.name || "كاشير",
        items: cart,
        subtotal: totals.subtotal,
        tax: totals.tax,
        discount: totals.discount,
        total: totals.total,
        orderType,
        customer: selectedCustomer || undefined,
        table: selectedTable || undefined,
        appliedDiscount,
      });

      if (printed) {
        showFeedback("تم طباعة الفاتورة", "success");
      } else {
        showFeedback("فشلت طباعة الفاتورة", "error");
      }
    } catch (error) {
      showFeedback("حدث خطأ أثناء الطباعة", "error");
    }
  };

  const handleViewOrders = () => {
    navigate("/orders");
  };

  const handleBarcodeScanned = (barcode: string) => {
    const product = products.find((p) => p.barcode === barcode);
    if (product) {
      addToCart(product);
    } else {
      showFeedback("المنتج غير موجود", "error");
    }
  };

  const handleReturns = () => {
    setIsReturnsModalOpen(true);
  };

  const handleSendToKitchen = async () => {
    if (cart.length === 0) {
      showFeedback("السلة فارغة", "error");
      return;
    }

    // Open kitchen send modal with preview
    setIsKitchenSendOpen(true);
  };

  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.barcode?.includes(searchQuery)
      )
    : products;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#023047] to-[#001219] pr-20">
      {/* Main Navigation Sidebar */}
      <MainNavigation />

      {/* Feedback Bar (Subtle, replaces toast) */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm ${
              feedback.type === "success"
                ? "bg-green-500/90 text-white"
                : feedback.type === "error"
                ? "bg-red-500/90 text-white"
                : "bg-blue-500/90 text-white"
            }`}
          >
            <p className="text-sm font-['Almarai'] font-bold" dir="auto">
              {feedback.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Product Grid with dynamic margin for cart */}
      <motion.div
        className="pt-6 pb-24 px-4 transition-all duration-300"
        animate={{
          marginLeft: isCartOpen ? "400px" : "0px",
        }}
      >
        {/* Category Filters & Search */}
        <div className="mb-6 space-y-4">
          {/* Categories with Keyboard Shortcuts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[rgba(255,255,255,0.1)] scrollbar-track-transparent">
            {categories.map((cat, index) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2.5 rounded-xl text-sm font-['Almarai'] transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-cyan-400 text-[#00373a] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_2px_6px_2px_rgba(0,0,0,0.15)]"
                    : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/50"
                }`}
              >
                <span dir="auto">{cat.name}</span> ({cat.count})
                {index < 9 && (
                  <span className="ml-2 text-xs opacity-70">[{index + 1}]</span>
                )}
              </button>
            ))}
          </div>

          {/* Search & Order Type */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`${t("common.search")}... (Ctrl+F)`}
                className="w-full h-12 px-4 pr-12 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-base text-[#e2e2e6] placeholder:text-[#c2c7ce] font-['Almarai'] focus:outline-none focus:border-cyan-400/50 transition-all"
                dir="rtl"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#c2c7ce]" />
            </div>

            {/* Order Type Dropdown */}
            <div className="relative group">
              <button className="h-12 px-8 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] text-base font-['Almarai'] hover:border-cyan-400/50 transition-colors flex items-center gap-3 min-w-[180px] justify-between">
                <span dir="auto">
                  {orderType === "takeaway" && t("pos.orderType.takeaway")}
                  {orderType === "dineIn" &&
                    (selectedTable
                      ? `${t("pos.table")} ${selectedTable.number}`
                      : t("pos.orderType.dineIn"))}
                  {orderType === "delivery" && t("pos.orderType.delivery")}
                </span>
                <ChevronDown className="w-5 h-5" />
              </button>

              {/* Dropdown */}
              <div className="absolute left-0 top-full mt-2 w-56 bg-[#1a1c1e] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={() => handleOrderTypeChange("takeaway")}
                  className="w-full px-5 py-4 text-right hover:bg-[rgba(255,255,255,0.05)] transition-colors first:rounded-t-xl"
                >
                  <span
                    className="text-base font-['Almarai'] text-[#e2e2e6]"
                    dir="auto"
                  >
                    {t("pos.orderType.takeaway")}
                  </span>
                </button>
                <button
                  onClick={() => setIsTableModalOpen(true)}
                  className="w-full px-5 py-4 text-right hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  <span
                    className="text-base font-['Almarai'] text-[#e2e2e6]"
                    dir="auto"
                  >
                    {t("pos.orderType.dineIn")}
                  </span>
                </button>
                <button
                  onClick={() => handleOrderTypeChange("delivery")}
                  className="w-full px-5 py-4 text-right hover:bg-[rgba(255,255,255,0.05)] transition-colors last:rounded-b-xl"
                >
                  <span
                    className="text-base font-['Almarai'] text-[#e2e2e6]"
                    dir="auto"
                  >
                    {t("pos.orderType.delivery")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <LoadingState loading={loading}>
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center mb-4">
                <Search className="w-12 h-12 text-[#c2c7ce] opacity-50" />
              </div>
              <h3
                className="text-xl font-['Almarai'] text-[#e2e2e6] mb-2"
                dir="auto"
              >
                لا توجد منتجات
              </h3>
              <p className="text-base text-[#c2c7ce]" dir="auto">
                جرب تغيير الفئة أو البحث بكلمات مختلفة
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product, index) => (
                <motion.button
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => addToCart(product)}
                  disabled={!product.isAvailable}
                  className={`bg-[rgba(255,255,255,0.05)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-xl p-4 text-right transition-all ${
                    product.isAvailable
                      ? "hover:border-cyan-400/50 hover:shadow-lg cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {/* Product Image */}
                  {product.imageUrl && (
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-[rgba(255,255,255,0.03)]">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Product Info */}
                  <h3
                    className="text-base font-['Almarai'] font-bold text-[#e2e2e6] mb-1 line-clamp-2"
                    dir="auto"
                  >
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#c2c7ce] mb-2 line-clamp-1">
                    {product.nameEn}
                  </p>

                  {/* Price & Stock */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-['Arial'] font-bold text-cyan-400">
                      {product.price.toFixed(2)} ر.س
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        product.stock > 10
                          ? "bg-green-500/20 text-green-400"
                          : product.stock > 0
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} متوفر` : "نفذ"}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </LoadingState>
      </motion.div>

      {/* POS Action Bar - Sticky at bottom, ABOVE cart panel */}
      <POSActionBar
        cartItemsCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        onCheckout={handleCheckout}
        onApplyDiscount={() => setIsDiscountModalOpen(true)}
        onSelectCustomer={handleSelectCustomer}
        onHoldOrder={handleHoldOrder}
        onRetrieveOrder={handleRetrieveOrder}
        onPrintReceipt={handlePrintReceipt}
        onViewOrders={handleViewOrders}
        onReturns={handleReturns}
        onSendToKitchen={handleSendToKitchen}
        hasItems={cart.length > 0}
      />

      {/* Cart Panel */}
      <CartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateCartItemQuantity}
        onRemoveItem={removeCartItem}
        onClearCart={clearCart}
        onAddNotes={() => {}}
        subtotal={totals.subtotal}
        tax={totals.tax}
        discount={totals.discount}
        total={totals.total}
      />

      {/* Payment Modal - Use Redesigned Version */}
      <PaymentModalRedesigned
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
        }}
        items={cart}
        subtotal={totals.subtotal}
        tax={totals.tax}
        discount={totals.discount}
        total={totals.total}
        orderType={orderType}
        customer={selectedCustomer}
        table={selectedTable}
        appliedDiscount={appliedDiscount}
        onPaymentComplete={handlePaymentComplete}
      />

      {/* Receipt Preview Modal */}
      <ReceiptPreviewModal
        isOpen={isReceiptPreviewOpen}
        onClose={handleReceiptPreviewClose}
        payment={completedPayment}
        items={cart}
        subtotal={totals.subtotal}
        tax={totals.tax}
        discount={totals.discount}
        total={totals.total}
        orderType={orderType}
        customer={selectedCustomer}
        table={selectedTable}
        appliedDiscount={appliedDiscount}
      />

      {/* Table Selector Modal */}
      <TableSelectorModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        onSelectTable={handleSelectTable}
      />

      {/* Discount Modal */}
      <DiscountModal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        onApplyDiscount={handleApplyDiscount}
        subtotal={totals.subtotal}
      />

      {/* Hold Orders Modal */}
      <HoldOrdersModal
        isOpen={isHoldOrdersModalOpen}
        onClose={() => setIsHoldOrdersModalOpen(false)}
        heldOrders={heldOrders.map((order) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          timestamp: order.timestamp,
          itemsCount: order.itemsCount,
          total: order.total,
          customerName: order.customerName,
        }))}
        onRetrieve={handleRetrieveHeldOrder}
        onDelete={handleDeleteHeldOrder}
      />

      {/* Customer Selector Modal */}
      <CustomerSelectorModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        customers={customers}
        selectedCustomer={selectedCustomer}
        onSelectCustomer={setSelectedCustomer}
        onAddCustomer={() => showFeedback("ميزة إضافة عميل قريباً", "info")}
      />

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
        onScan={handleBarcodeScanned}
      />

      {/* Product Modifiers Modal */}
      {selectedProductForModifiers && (
        <ProductModifiersModal
          isOpen={isModifiersModalOpen}
          onClose={() => {
            setIsModifiersModalOpen(false);
            setSelectedProductForModifiers(null);
          }}
          product={selectedProductForModifiers}
          quantity={1}
          onConfirm={addToCartWithModifiers}
        />
      )}

      {/* Returns & Exchanges Modal */}
      <ReturnsModal
        isOpen={isReturnsModalOpen}
        onClose={() => setIsReturnsModalOpen(false)}
        onReturnComplete={(message) => {
          showFeedback(message, "success");
          setIsReturnsModalOpen(false);
        }}
      />

      {/* Kitchen Send Modal */}
      <KitchenSendModal
        isOpen={isKitchenSendOpen}
        onClose={handleKitchenSendComplete}
        items={cart}
        orderType={orderType}
        table={selectedTable}
      />
    </div>
  );
}
