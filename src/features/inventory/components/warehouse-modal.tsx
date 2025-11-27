/**
 * Warehouse Modal
 * Add/Edit warehouse with full details
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Warehouse as WarehouseIcon,
  MapPin,
  Package,
  Save,
  AlertCircle,
  CheckCircle,
  Trash2,
} from "lucide-react";
import type { Warehouse } from "../types/inventory.types";

interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouse?: Warehouse | null; // null for add, object for edit
  onSave: (warehouse: Partial<Warehouse>) => Promise<void>;
  onDelete?: (warehouseId: string) => Promise<void>;
}

export function WarehouseModal({
  isOpen,
  onClose,
  warehouse,
  onSave,
  onDelete,
}: WarehouseModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
    isDefault: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditMode = !!warehouse;

  useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse.name,
        location: warehouse.location,
        capacity: warehouse.capacity.toString(),
        isDefault: warehouse.isDefault,
      });
    } else {
      setFormData({
        name: "",
        location: "",
        capacity: "",
        isDefault: false,
      });
    }
    setError("");
    setShowDeleteConfirm(false);
  }, [warehouse, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("اسم المستودع مطلوب");
      return;
    }

    if (!formData.location.trim()) {
      setError("موقع المستودع مطلوب");
      return;
    }

    const capacity = parseFloat(formData.capacity);
    if (!formData.capacity || isNaN(capacity) || capacity <= 0) {
      setError("السعة يجب أن تكون رقم أكبر من صفر");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        ...(warehouse?.id && { id: warehouse.id }),
        name: formData.name.trim(),
        location: formData.location.trim(),
        capacity: capacity,
        isDefault: formData.isDefault,
        ...(warehouse && { used: warehouse.used }),
      });
      onClose();
    } catch (error) {
      setError("فشل حفظ المستودع");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!warehouse || !onDelete) return;

    setIsSubmitting(true);
    try {
      await onDelete(warehouse.id);
      onClose();
    } catch (error) {
      setError("فشل حذف المستودع");
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getUsagePercentage = () => {
    if (!warehouse) return 0;
    return (warehouse.used / warehouse.capacity) * 100;
  };

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
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(255,255,255,0.1)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[rgba(139,92,246,0.2)] to-[rgba(124,58,237,0.1)] border border-purple-400/30 flex items-center justify-center">
              <WarehouseIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-['Almarai'] font-bold text-[#e2e2e6]">
                {isEditMode ? "تعديل المستودع" : "إضافة مستودع جديد"}
              </h2>
              {isEditMode && warehouse && (
                <p className="text-sm text-[#c2c7ce] font-['Almarai']">
                  {warehouse.name}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] transition-all"
          >
            <X className="w-5 h-5 text-[#c2c7ce]" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Current Usage (Edit Mode Only) */}
            {isEditMode && warehouse && (
              <div className="p-4 rounded-xl bg-linear-to-br from-[rgba(139,92,246,0.1)] to-[rgba(124,58,237,0.05)] border border-purple-400/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-['Almarai'] font-bold text-[#e2e2e6]">
                    الاستخدام الحالي
                  </span>
                  <span className="text-sm font-['Arial'] text-purple-400">
                    {getUsagePercentage().toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-purple-400 to-purple-600 transition-all"
                    style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                    مستخدم: {warehouse.used.toLocaleString("ar-SA")}
                  </span>
                  <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                    السعة: {warehouse.capacity.toLocaleString("ar-SA")}
                  </span>
                </div>
              </div>
            )}

            {/* Warehouse Name */}
            <div>
              <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block text-right">
                اسم المستودع <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="مثال: المستودع الرئيسي"
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Almarai'] placeholder:text-[#6b7280] focus:outline-none focus:border-purple-400/50 transition-colors"
                dir="rtl"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block text-right">
                الموقع <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c2c7ce] pointer-events-none" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="مثال: الرياض - حي العليا - شارع التحلية"
                  className="w-full pr-12 pl-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Almarai'] placeholder:text-[#6b7280] focus:outline-none focus:border-purple-400/50 transition-colors"
                  dir="rtl"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Capacity */}
            <div>
              <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block text-right">
                السعة القصوى <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Package className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c2c7ce] pointer-events-none" />
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  placeholder="أدخل السعة القصوى"
                  className="w-full pr-12 pl-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Arial'] placeholder:text-[#6b7280] focus:outline-none focus:border-purple-400/50 transition-colors"
                  dir="rtl"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-xs text-[#6b7280] font-['Almarai'] mt-2 text-right">
                السعة القصوى بعدد الوحدات التي يمكن تخزينها
              </p>
            </div>

            {/* Is Default */}
            <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                  className="w-5 h-5 rounded bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-purple-400 focus:ring-purple-400 focus:ring-offset-0"
                  disabled={isSubmitting}
                />
                <div className="flex-1">
                  <span className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] block">
                    تعيين كمستودع افتراضي
                  </span>
                  <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                    سيتم استخدام هذا المستودع تلقائياً عند إضافة منتجات جديدة
                  </span>
                </div>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-sm font-['Almarai'] text-red-400">{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Footer - Fixed */}
        <div className="px-6 py-4 border-t border-[rgba(255,255,255,0.1)] flex gap-3 shrink-0">
          {/* Delete Button (Edit Mode Only) */}
          {isEditMode && onDelete && !showDeleteConfirm && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-['Almarai'] font-bold transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>حذف</span>
            </button>
          )}

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] font-['Almarai'] font-bold transition-all disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-xl bg-linear-to-b from-red-500 to-red-600 text-white hover:opacity-90 font-['Almarai'] font-bold transition-all disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>{isSubmitting ? "جاري الحذف..." : "تأكيد الحذف"}</span>
              </button>
            </>
          )}

          {/* Save/Cancel Buttons */}
          {!showDeleteConfirm && (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] font-['Almarai'] font-bold transition-all disabled:opacity-50 text-center"
              >
                إلغاء
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-xl bg-linear-to-b from-purple-400 to-purple-600 text-white hover:opacity-90 font-['Almarai'] font-bold transition-all disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                <span>
                  {isSubmitting
                    ? "جاري الحفظ..."
                    : isEditMode
                    ? "حفظ التعديلات"
                    : "إضافة المستودع"}
                </span>
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
