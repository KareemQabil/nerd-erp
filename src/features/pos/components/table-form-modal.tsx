/**
 * Table Form Modal
 * Add/Edit table with full details
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, AlertCircle, Users, MapPin } from "lucide-react";
import type { Table } from "../types/pos.types";

interface TableFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  table?: Table | null;
  onSave: (table: Partial<Table>) => Promise<void>;
}

export function TableFormModal({
  isOpen,
  onClose,
  table,
  onSave,
}: TableFormModalProps) {
  const [formData, setFormData] = useState({
    number: "",
    zone: "indoor" as "indoor" | "outdoor" | "vip",
    capacity: "4",
    status: "available" as Table["status"],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = !!table;

  useEffect(() => {
    if (table) {
      setFormData({
        number: table.number,
        zone: table.zone as "indoor" | "outdoor" | "vip",
        capacity: table.capacity.toString(),
        status: table.status,
      });
    } else {
      setFormData({
        number: "",
        zone: "indoor",
        capacity: "4",
        status: "available",
      });
    }
    setError("");
  }, [table, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.number.trim()) {
      setError("رقم الطاولة مطلوب");
      return;
    }

    const capacity = parseInt(formData.capacity);
    if (isNaN(capacity) || capacity < 1) {
      setError("السعة يجب أن تكون رقم أكبر من صفر");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        ...(table?.id && { id: table.id }),
        number: formData.number.trim(),
        zone: formData.zone,
        capacity,
        status: formData.status,
      });
      onClose();
    } catch (error) {
      setError("فشل حفظ الطاولة");
    } finally {
      setIsSubmitting(false);
    }
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
        className="relative w-full max-w-lg bg-[#2a2d32] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(255,255,255,0.1)]">
          <div>
            <h2 className="text-lg font-['Almarai'] font-bold text-[#e2e2e6]">
              {isEditMode ? "تعديل الطاولة" : "إضافة طاولة جديدة"}
            </h2>
            {isEditMode && table && (
              <p className="text-sm text-[#c2c7ce] font-['Almarai']">
                طاولة رقم {table.number}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] transition-all"
          >
            <X className="w-5 h-5 text-[#c2c7ce]" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Table Number */}
          <div>
            <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
              رقم الطاولة <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) =>
                setFormData({ ...formData, number: e.target.value })
              }
              placeholder="مثال: 1 أو A1"
              className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Arial'] placeholder:text-[#6b7280] focus:outline-none focus:border-cyan-400/50 transition-colors"
              required
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          {/* Zone */}
          <div>
            <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
              <MapPin className="w-4 h-4 inline-block ml-1" />
              المنطقة <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, zone: "indoor" })}
                className={`px-4 py-3 rounded-xl font-['Almarai'] transition-all ${
                  formData.zone === "indoor"
                    ? "bg-cyan-400 text-[#00373a] shadow-lg"
                    : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/50"
                }`}
                disabled={isSubmitting}
              >
                داخلي
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, zone: "outdoor" })}
                className={`px-4 py-3 rounded-xl font-['Almarai'] transition-all ${
                  formData.zone === "outdoor"
                    ? "bg-cyan-400 text-[#00373a] shadow-lg"
                    : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/50"
                }`}
                disabled={isSubmitting}
              >
                خارجي
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, zone: "vip" })}
                className={`px-4 py-3 rounded-xl font-['Almarai'] transition-all ${
                  formData.zone === "vip"
                    ? "bg-cyan-400 text-[#00373a] shadow-lg"
                    : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/50"
                }`}
                disabled={isSubmitting}
              >
                VIP
              </button>
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
              <Users className="w-4 h-4 inline-block ml-1" />
              السعة (عدد الأشخاص) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Arial'] focus:outline-none focus:border-cyan-400/50 transition-colors"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Status (only in edit mode) */}
          {isEditMode && (
            <div>
              <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
                حالة الطاولة
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, status: "available" })
                  }
                  className={`px-4 py-3 rounded-xl font-['Almarai'] transition-all ${
                    formData.status === "available"
                      ? "bg-green-500 text-white shadow-lg"
                      : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-green-500/50"
                  }`}
                  disabled={isSubmitting}
                >
                  متاحة
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, status: "reserved" })
                  }
                  className={`px-4 py-3 rounded-xl font-['Almarai'] transition-all ${
                    formData.status === "reserved"
                      ? "bg-orange-500 text-white shadow-lg"
                      : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-orange-500/50"
                  }`}
                  disabled={isSubmitting}
                >
                  محجوزة
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, status: "cleaning" })
                  }
                  className={`px-4 py-3 rounded-xl font-['Almarai'] transition-all ${
                    formData.status === "cleaning"
                      ? "bg-gray-500 text-white shadow-lg"
                      : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-gray-500/50"
                  }`}
                  disabled={isSubmitting}
                >
                  تنظيف
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, status: "occupied" })
                  }
                  className={`px-4 py-3 rounded-xl font-['Almarai'] transition-all ${
                    formData.status === "occupied"
                      ? "bg-red-500 text-white shadow-lg"
                      : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-red-500/50"
                  }`}
                  disabled={isSubmitting}
                >
                  مشغولة
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm font-['Almarai'] text-red-400">{error}</p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[rgba(255,255,255,0.1)] flex gap-3">
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
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 rounded-xl bg-linear-to-b from-[#22d3ee] to-[#006399] text-[#00373a] hover:opacity-90 font-['Almarai'] font-bold transition-all disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>
              {isSubmitting
                ? "جاري الحفظ..."
                : isEditMode
                ? "حفظ التعديلات"
                : "إضافة الطاولة"}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
