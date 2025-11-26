import React, { useState } from "react";
import type { Product, Warehouse } from "../types/inventory.types";
import { X, Plus, Minus, Package, AlertCircle } from "lucide-react";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { StyledNumberInput } from "@/components/ui/styled-number-input";
import { motion } from "motion/react";

interface StockAdjustmentModalProps {
  product: Product;
  warehouses: Warehouse[];
  onClose: () => void;
  onAdjust: (adjustments: {
    warehouseId: string;
    quantity: number;
    type: "add" | "remove" | "set";
    reason: string;
  }) => Promise<void>;
}

export function StockAdjustmentModal({
  product,
  warehouses,
  onClose,
  onAdjust,
}: StockAdjustmentModalProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>(
    warehouses[0]?.id || ""
  );
  const [adjustmentType, setAdjustmentType] = useState<
    "add" | "remove" | "set"
  >("add");
  const [quantity, setQuantity] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const getCurrentStock = () => {
    const warehouse = product.warehouses.find(
      (w) => w.warehouseId === selectedWarehouse
    );
    return warehouse?.quantity || 0;
  };

  const getNewStock = () => {
    const current = getCurrentStock();
    const qty = parseFloat(quantity) || 0;

    switch (adjustmentType) {
      case "add":
        return current + qty;
      case "remove":
        return Math.max(0, current - qty);
      case "set":
        return qty;
      default:
        return current;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      setError("الرجاء إدخال كمية صحيحة");
      return;
    }

    if (!reason.trim()) {
      setError("الرجاء إدخال سبب التعديل");
      return;
    }

    if (adjustmentType === "remove" && qty > getCurrentStock()) {
      setError("الكمية المطلوبة أكبر من المخزون الحالي");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdjust({
        warehouseId: selectedWarehouse,
        quantity: qty,
        type: adjustmentType,
        reason,
      });
      onClose();
    } catch (err) {
      setError("حدث خطأ في تعديل المخزون");
    } finally {
      setIsSubmitting(false);
    }
  };

  const predefinedReasons = [
    "إضافة مشتريات جديدة",
    "تسوية جرد",
    "منتجات تالفة",
    "منتجات منتهية الصلاحية",
    "تحويل بين المستودعات",
    "مرتجع من عميل",
    "عينات",
    "خطأ في الإدخال",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-8"
      dir="rtl"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl max-h-[calc(100vh-128px)] bg-[#2a2d32] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(255,255,255,0.1)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgba(34,211,238,0.2)] to-[rgba(0,99,153,0.1)] border border-cyan-400/30 flex items-center justify-center">
              <Package className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-['Almarai'] font-bold text-[#e2e2e6]">
                تعديل المخزون
              </h2>
              <p className="text-sm text-[#c2c7ce] font-['Almarai']">
                {product.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] transition-all"
          >
            <X className="w-5 h-5 text-[#c2c7ce]" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Warehouse Selection */}
            <div>
              <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
                المستودع
              </label>
              <CustomDropdown
                value={selectedWarehouse}
                onChange={(value) => setSelectedWarehouse(value)}
                options={warehouses.map((warehouse) => {
                  const productWh = product.warehouses.find(
                    (w) => w.warehouseId === warehouse.id
                  );
                  return {
                    value: warehouse.id,
                    label: `${warehouse.name} - الكمية الحالية: ${
                      productWh?.quantity || 0
                    } ${product.unit}`,
                  };
                })}
                placeholder="اختر المستودع"
                dir="rtl"
                className="w-full"
              />
            </div>

            {/* Current Stock Display */}
            <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-['Almarai'] text-[#c2c7ce]">
                  المخزون الحالي
                </span>
                <span className="text-2xl font-['Arial'] font-bold text-cyan-400">
                  {getCurrentStock()} {product.unit}
                </span>
              </div>
            </div>

            {/* Adjustment Type */}
            <div>
              <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-3 block">
                نوع التعديل
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustmentType("add")}
                  className={`p-4 rounded-xl border transition-all ${
                    adjustmentType === "add"
                      ? "bg-green-400/10 border-green-400/30 text-green-400"
                      : "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/30"
                  }`}
                >
                  <Plus className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-['Almarai'] font-bold block">
                    إضافة
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustmentType("remove")}
                  className={`p-4 rounded-xl border transition-all ${
                    adjustmentType === "remove"
                      ? "bg-red-400/10 border-red-400/30 text-red-400"
                      : "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/30"
                  }`}
                >
                  <Minus className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-['Almarai'] font-bold block">
                    خصم
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustmentType("set")}
                  className={`p-4 rounded-xl border transition-all ${
                    adjustmentType === "set"
                      ? "bg-orange-400/10 border-orange-400/30 text-orange-400"
                      : "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/30"
                  }`}
                >
                  <Package className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-['Almarai'] font-bold block">
                    تعيين
                  </span>
                </button>
              </div>
            </div>

            {/* Quantity Input */}
            <div>
              <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
                الكمية
              </label>
              <div className="relative">
                <StyledNumberInput
                  value={quantity}
                  onChange={(value) => setQuantity(value)}
                  placeholder="أدخل الكمية"
                  min="0"
                  step="0.01"
                  disabled={isSubmitting}
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-['Almarai'] text-[#c2c7ce]">
                  {product.unit}
                </span>
              </div>
            </div>

            {/* New Stock Preview */}
            {quantity && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(34,211,238,0.1)] to-[rgba(0,99,153,0.05)] border border-cyan-400/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-['Almarai'] font-bold text-[#e2e2e6]">
                    المخزون الجديد
                  </span>
                  <div className="text-left">
                    <span className="text-2xl font-['Arial'] font-bold text-cyan-400">
                      {getNewStock()}
                    </span>
                    <span className="text-sm font-['Almarai'] text-[#c2c7ce] mr-2">
                      {product.unit}
                    </span>
                    <div className="text-xs font-['Arial'] text-[#c2c7ce] mt-1">
                      {adjustmentType === "add" && `+${quantity}`}
                      {adjustmentType === "remove" && `-${quantity}`}
                      {adjustmentType === "set" &&
                        `${
                          parseFloat(quantity) - getCurrentStock() > 0
                            ? "+"
                            : ""
                        }${parseFloat(quantity) - getCurrentStock()}`}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
                سبب التعديل
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="أدخل سبب التعديل..."
                rows={3}
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Almarai'] focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
                dir="rtl"
                required
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {predefinedReasons.map((predefinedReason) => (
                  <button
                    key={predefinedReason}
                    type="button"
                    onClick={() => setReason(predefinedReason)}
                    className="px-3 py-1.5 text-xs rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/50 hover:text-cyan-400 transition-all font-['Almarai']"
                  >
                    {predefinedReason}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm font-['Almarai'] text-red-400">{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Footer - Fixed */}
        <div className="px-6 py-4 border-t border-[rgba(255,255,255,0.1)] flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] font-['Almarai'] font-bold transition-all disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              const form = e.currentTarget.closest("form");
              if (form) {
                const submitEvent = new Event("submit", {
                  bubbles: true,
                  cancelable: true,
                });
                form.dispatchEvent(submitEvent);
              }
            }}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-b from-[#22d3ee] to-[#006399] text-[#00373a] hover:opacity-90 font-['Almarai'] font-bold transition-all disabled:opacity-50 shadow-lg"
          >
            {isSubmitting ? "جاري التعديل..." : "تأكيد التعديل"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
