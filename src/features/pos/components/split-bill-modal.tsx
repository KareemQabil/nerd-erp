import React, { useState } from "react";
import { X, Users, List, DollarSign, Scissors } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { CartItem, BillSplit } from "../types/pos.types";
import { SplitBillService } from "../services/pos.service";

interface SplitBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onSplitConfirm: (split: BillSplit) => void;
}

export function SplitBillModal({
  isOpen,
  onClose,
  items,
  total,
  onSplitConfirm,
}: SplitBillModalProps) {
  const [splitType, setSplitType] = useState<"equal" | "by_item">("equal");
  const [numParts, setNumParts] = useState(2);

  const handleConfirm = () => {
    let split: BillSplit;

    if (splitType === "equal") {
      split = SplitBillService.createEqualSplit(items, numParts, total);
    } else {
      split = SplitBillService.createItemSplit(items);
    }

    onSplitConfirm(split);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[var(--surface)] rounded-2xl shadow-[0px_10px_38px_-10px_rgba(0,0,0,0.3)] w-full max-w-lg overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--outline-variant)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                <Scissors className="w-5 h-5 text-cyan-400" />
              </div>
              <h2
                className="font-['Almarai'] text-[var(--on-surface)]"
                dir="rtl"
              >
                تقسيم الفاتورة
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--surface-variant)] text-[var(--on-surface)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Split Type Selection */}
            <div className="space-y-3">
              <label
                className="font-['Almarai'] text-[var(--on-surface)]"
                dir="rtl"
              >
                طريقة التقسيم
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSplitType("equal")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    splitType === "equal"
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-[var(--outline-variant)] hover:border-cyan-400/50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Users className="w-6 h-6 text-cyan-400" />
                    <span className="font-['Almarai'] text-[var(--on-surface)]">
                      تقسيم متساوي
                    </span>
                    <span className="text-xs text-[var(--on-surface-variant)]">
                      نفس المبلغ للجميع
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setSplitType("by_item")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    splitType === "by_item"
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-[var(--outline-variant)] hover:border-cyan-400/50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <List className="w-6 h-6 text-cyan-400" />
                    <span className="font-['Almarai'] text-[var(--on-surface)]">
                      حسب المنتجات
                    </span>
                    <span className="text-xs text-[var(--on-surface-variant)]">
                      كل شخص يدفع منتجاته
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Number of Parts (for equal split) */}
            {splitType === "equal" && (
              <div className="space-y-3">
                <label
                  className="font-['Almarai'] text-[var(--on-surface)]"
                  dir="rtl"
                >
                  عدد الأشخاص
                </label>
                <div className="flex gap-2">
                  {[2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => setNumParts(num)}
                      className={`flex-1 py-3 rounded-xl border-2 transition-all font-['Inter'] ${
                        numParts === num
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-[var(--outline-variant)] hover:border-cyan-400/50"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Preview */}
            <div className="p-4 rounded-xl bg-[var(--surface-variant)] space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span
                  className="font-['Almarai'] text-[var(--on-surface-variant)]"
                  dir="rtl"
                >
                  الإجمالي الكلي
                </span>
                <span className="font-['Inter'] text-[var(--on-surface)]">
                  {total.toFixed(2)} ر.س
                </span>
              </div>

              {splitType === "equal" && (
                <>
                  <div className="h-px bg-[var(--outline-variant)]" />
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className="font-['Almarai'] text-[var(--on-surface-variant)]"
                      dir="rtl"
                    >
                      حصة كل شخص
                    </span>
                    <span className="font-['Inter'] text-cyan-400 font-bold">
                      {(total / numParts).toFixed(2)} ر.س
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Info */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <DollarSign className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-500 font-['Almarai']" dir="rtl">
                {splitType === "equal"
                  ? `سيتم تقسيم الفاتورة بالتساوي على ${numParts} أشخاص`
                  : "سيتم تقسيم الفاتورة حسب المنتجات المطلوبة"}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[var(--outline-variant)]">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-[var(--surface-variant)] text-[var(--on-surface)] font-['Almarai'] hover:bg-[var(--outline-variant)] transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-xl bg-cyan-400 text-[#00373a] font-['Almarai'] hover:bg-cyan-500 transition-colors"
              >
                تأكيد التقسيم
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
