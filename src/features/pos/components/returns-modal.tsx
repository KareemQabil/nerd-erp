import React, { useState } from "react";
import { X, RotateCcw, RefreshCw, Search, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type {
  CartItem,
  ReturnItem,
  ReturnReason,
  RefundMethod,
} from "../types/pos.types";
import { ReturnService } from "../services/pos.service";

interface ReturnsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReturnComplete: (message: string) => void;
}

export function ReturnsModal({
  isOpen,
  onClose,
  onReturnComplete,
}: ReturnsModalProps) {
  const [mode, setMode] = useState<"return" | "exchange">("return");
  const [orderNumber, setOrderNumber] = useState("");
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [returnReason, setReturnReason] =
    useState<ReturnReason>("customer_request");
  const [refundMethod, setRefundMethod] = useState<RefundMethod>("original");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Mock order items for demo
  const mockOrderItems: CartItem[] = [
    {
      id: "1",
      productId: "2",
      product: {
        id: "2",
        name: "لاتيه كلاسيكي",
        nameEn: "Classic Latte",
        price: 15.0,
        categoryId: "hot",
        stock: 30,
        isCustomizable: true,
        isActive: true,
        isAvailable: true,
      },
      quantity: 2,
      price: 15.0,
      total: 30.0,
    },
  ];

  const returnReasons: { value: ReturnReason; label: string }[] = [
    { value: "wrong_item", label: "منتج خاطئ" },
    { value: "quality_issue", label: "مشكلة في الجودة" },
    { value: "customer_request", label: "طلب العميل" },
    { value: "damaged", label: "منتج تالف" },
    { value: "other", label: "أخرى" },
  ];

  const refundMethods: { value: RefundMethod; label: string }[] = [
    { value: "original", label: "نفس طريقة الدفع" },
    { value: "cash", label: "نقدي" },
    { value: "store_credit", label: "رصيد المتجر" },
  ];

  const handleSearchOrder = () => {
    // In real app, search for order by number
    if (orderNumber.trim()) {
      // Simulate finding order
      setReturnItems([]);
    }
  };

  const handleToggleItem = (item: CartItem, quantity: number) => {
    const existingIndex = returnItems.findIndex(
      (ri) => ri.cartItemId === item.id
    );

    if (existingIndex >= 0) {
      if (quantity === 0) {
        setReturnItems((prev) =>
          prev.filter((_, idx) => idx !== existingIndex)
        );
      } else {
        setReturnItems((prev) =>
          prev.map((ri, idx) =>
            idx === existingIndex
              ? { ...ri, quantity, reason: returnReason }
              : ri
          )
        );
      }
    } else {
      setReturnItems((prev) => [
        ...prev,
        {
          cartItemId: item.id,
          productId: item.productId,
          productName: item.product.name,
          quantity,
          price: item.price,
          reason: returnReason,
          notes,
        },
      ]);
    }
  };

  const calculateReturnTotal = () => {
    const subtotal = returnItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.15;
    return subtotal + tax;
  };

  const handleProcessReturn = async () => {
    if (returnItems.length === 0) return;

    setLoading(true);
    try {
      const returnTx = await ReturnService.createReturn(
        "order-123",
        orderNumber || "ORD-001",
        returnItems,
        refundMethod
      );

      if (returnTx.requiresApproval) {
        onReturnComplete("تم إرسال طلب الاسترجاع للموافقة");
      } else {
        onReturnComplete(
          `تم معالجة الاسترجاع بنجاح - ${returnTx.total.toFixed(2)} ر.س`
        );
      }

      onClose();
      resetForm();
    } catch (error) {
      console.error("Return processing failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setOrderNumber("");
    setReturnItems([]);
    setReturnReason("customer_request");
    setRefundMethod("original");
    setNotes("");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[var(--surface)] rounded-2xl shadow-[0px_10px_38px_-10px_rgba(0,0,0,0.3)] w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--outline-variant)]">
            <div className="flex items-center gap-4">
              <div className="flex gap-2 bg-[var(--surface-variant)] p-1 rounded-lg">
                <button
                  onClick={() => setMode("return")}
                  className={`px-4 py-2 rounded-md font-['Almarai'] transition-colors ${
                    mode === "return"
                      ? "bg-cyan-400 text-[#00373a]"
                      : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    <span>استرجاع</span>
                  </div>
                </button>
                <button
                  onClick={() => setMode("exchange")}
                  className={`px-4 py-2 rounded-md font-['Almarai'] transition-colors ${
                    mode === "exchange"
                      ? "bg-cyan-400 text-[#00373a]"
                      : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    <span>استبدال</span>
                  </div>
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--surface-variant)] text-[var(--on-surface)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Order Search */}
            <div className="space-y-3">
              <label
                className="font-['Almarai'] text-[var(--on-surface)]"
                dir="rtl"
              >
                رقم الفاتورة
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="أدخل رقم الفاتورة..."
                  className="flex-1 p-3 rounded-xl bg-[var(--surface-variant)] text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)] border border-[var(--outline-variant)] focus:border-cyan-400 outline-none font-['Inter']"
                  dir="ltr"
                />
                <button
                  onClick={handleSearchOrder}
                  className="px-6 py-3 rounded-xl bg-cyan-400 text-[#00373a] hover:bg-cyan-500 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Order Items (Mock) */}
            {orderNumber && (
              <div className="space-y-3">
                <h3
                  className="font-['Almarai'] text-[var(--on-surface)]"
                  dir="rtl"
                >
                  عناصر الفاتورة
                </h3>

                {mockOrderItems.map((item) => {
                  const returnItem = returnItems.find(
                    (ri) => ri.cartItemId === item.id
                  );
                  const returnQty = returnItem?.quantity || 0;

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-[var(--surface-variant)] border border-[var(--outline-variant)]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p
                            className="font-['Almarai'] text-[var(--on-surface)]"
                            dir="rtl"
                          >
                            {item.product.name}
                          </p>
                          <p className="text-sm text-[var(--on-surface-variant)]">
                            {item.price.toFixed(2)} ر.س × {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleToggleItem(item, Math.max(0, returnQty - 1))
                            }
                            className="w-8 h-8 rounded-lg bg-[var(--surface)] hover:bg-red-500/20 flex items-center justify-center transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-['Inter'] text-[var(--on-surface)]">
                            {returnQty}
                          </span>
                          <button
                            onClick={() =>
                              handleToggleItem(
                                item,
                                Math.min(item.quantity, returnQty + 1)
                              )
                            }
                            className="w-8 h-8 rounded-lg bg-cyan-400 hover:bg-cyan-500 flex items-center justify-center transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {returnItems.length > 0 && (
              <>
                {/* Return Reason */}
                <div className="space-y-3">
                  <label
                    className="font-['Almarai'] text-[var(--on-surface)]"
                    dir="rtl"
                  >
                    سبب الاسترجاع
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) =>
                      setReturnReason(e.target.value as ReturnReason)
                    }
                    className="w-full p-3 rounded-xl bg-[var(--surface-variant)] text-[var(--on-surface)] border border-[var(--outline-variant)] focus:border-cyan-400 outline-none font-['Almarai']"
                    dir="rtl"
                  >
                    {returnReasons.map((reason) => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Refund Method */}
                <div className="space-y-3">
                  <label
                    className="font-['Almarai'] text-[var(--on-surface)]"
                    dir="rtl"
                  >
                    طريقة الاسترجاع
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {refundMethods.map((method) => (
                      <button
                        key={method.value}
                        onClick={() => setRefundMethod(method.value)}
                        className={`p-3 rounded-xl border-2 transition-all font-['Almarai'] ${
                          refundMethod === method.value
                            ? "border-cyan-400 bg-cyan-400/10"
                            : "border-[var(--outline-variant)] hover:border-cyan-400/50"
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-3">
                  <label
                    className="font-['Almarai'] text-[var(--on-surface)]"
                    dir="rtl"
                  >
                    ملاحظات
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ملاحظات إضافية..."
                    className="w-full p-3 rounded-xl bg-[var(--surface-variant)] text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)] border border-[var(--outline-variant)] focus:border-cyan-400 outline-none resize-none font-['Almarai']"
                    rows={3}
                    dir="rtl"
                  />
                </div>

                {/* Manager Approval Warning */}
                {calculateReturnTotal() > 100 && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p
                      className="text-sm text-amber-500 font-['Almarai']"
                      dir="rtl"
                    >
                      هذا الاسترجاع يتطلب موافقة المدير لأن المبلغ يزيد عن 100
                      ر.س
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[var(--outline-variant)] space-y-4">
            {returnItems.length > 0 && (
              <div className="flex items-center justify-between">
                <span
                  className="font-['Almarai'] text-[var(--on-surface)]"
                  dir="rtl"
                >
                  إجمالي الاسترجاع
                </span>
                <span className="font-['Inter'] text-2xl text-cyan-400">
                  {calculateReturnTotal().toFixed(2)} ر.س
                </span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-[var(--surface-variant)] text-[var(--on-surface)] font-['Almarai'] hover:bg-[var(--outline-variant)] transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleProcessReturn}
                disabled={returnItems.length === 0 || loading}
                className="flex-1 py-3 rounded-xl bg-cyan-400 text-[#00373a] font-['Almarai'] hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "جاري المعالجة..." : "معالجة الاسترجاع"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
