import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Discount } from "../types/pos.types";
import { DiscountService } from "../services/pos.service";
import { X, Percent, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDiscount: (discount: Discount, customValue?: number) => void;
  subtotal: number;
}

export function DiscountModal({
  isOpen,
  onClose,
  onApplyDiscount,
  subtotal,
}: DiscountModalProps) {
  const { t } = useTranslation();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [customValue, setCustomValue] = useState<string>("");
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      loadDiscounts();
    }
  }, [isOpen]);

  const loadDiscounts = async () => {
    try {
      const data = await DiscountService.getDiscounts();
      setDiscounts(data);
    } catch (error) {
      console.error("Error loading discounts:", error);
    }
  };

  const calculateDiscountAmount = (discount: Discount, customVal?: number) => {
    const value = customVal !== undefined ? customVal : discount.value;
    if (discount.type === "percentage") {
      return (subtotal * value) / 100;
    }
    return value;
  };

  const handleApply = () => {
    if (selectedDiscount) {
      if (selectedDiscount.id === "d10") {
        // Custom discount
        const value = parseFloat(customValue);
        if (value > 0) {
          onApplyDiscount(selectedDiscount, value);
          onClose();
        }
      } else {
        onApplyDiscount(selectedDiscount);
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-b from-[#1a1c1e] via-[#1d2222] to-[#2a2f35] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)]">
                <div>
                  <h2
                    className="text-2xl font-['Almarai'] font-bold text-[#e2e2e6] mb-1"
                    dir="auto"
                  >
                    {t("pos.applyDiscount")}
                  </h2>
                  <p
                    className="text-sm text-[#c2c7ce] font-['Almarai']"
                    dir="auto"
                  >
                    اختر نوع الخصم المناسب
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  <X className="w-6 h-6 text-[#c2c7ce]" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                {/* Subtotal Display */}
                <div className="bg-gradient-to-r from-[rgba(34,211,238,0.1)] to-[rgba(0,99,153,0.1)] border border-cyan-400/30 rounded-2xl p-4 text-center">
                  <p
                    className="text-sm text-[#c2c7ce] font-['Almarai'] mb-1"
                    dir="auto"
                  >
                    {t("pos.subtotal")}
                  </p>
                  <p className="text-2xl font-['Arial'] font-bold text-[#99f0ff]">
                    {subtotal.toFixed(2)} ر.س
                  </p>
                </div>

                {/* Discount Options Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {discounts.slice(0, 9).map((discount) => {
                    const discountAmount = calculateDiscountAmount(discount);
                    const isSelected = selectedDiscount?.id === discount.id;

                    return (
                      <motion.button
                        key={discount.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDiscount(discount)}
                        className={`relative p-4 rounded-2xl transition-all ${
                          isSelected
                            ? "bg-gradient-to-b from-[#22d3ee] to-[#006399] text-white shadow-lg"
                            : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/50"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          {discount.type === "percentage" ? (
                            <Percent className="w-6 h-6" />
                          ) : (
                            <DollarSign className="w-6 h-6" />
                          )}
                          <div className="text-center">
                            <p className="text-lg font-['Arial'] font-bold">
                              {discount.type === "percentage"
                                ? `${discount.value}%`
                                : `${discount.value} ر.س`}
                            </p>
                            <p className="text-xs font-['Arial'] opacity-70 mt-1">
                              -{discountAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Custom Discount */}
                <div className="space-y-3">
                  <button
                    onClick={() =>
                      setSelectedDiscount(
                        discounts.find((d) => d.id === "d10") || null
                      )
                    }
                    className={`w-full p-4 rounded-2xl transition-all ${
                      selectedDiscount?.id === "d10"
                        ? "bg-gradient-to-b from-[#22d3ee] to-[#006399] text-white shadow-lg"
                        : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/50"
                    }`}
                  >
                    <span className="font-['Almarai']" dir="auto">
                      {t("pos.customDiscount")}
                    </span>
                  </button>

                  {selectedDiscount?.id === "d10" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <input
                        type="number"
                        value={customValue}
                        onChange={(e) => setCustomValue(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-xl font-['Arial'] font-bold text-[#e2e2e6] text-center focus:outline-none focus:border-cyan-400/50 transition-colors"
                        dir="ltr"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedDiscount({
                              ...selectedDiscount,
                              type: "percentage",
                            });
                          }}
                          className={`flex-1 py-3 rounded-xl font-['Almarai'] transition-all ${
                            selectedDiscount.type === "percentage"
                              ? "bg-cyan-400 text-[#00373a]"
                              : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce]"
                          }`}
                        >
                          نسبة مئوية %
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDiscount({
                              ...selectedDiscount,
                              type: "fixed",
                            });
                          }}
                          className={`flex-1 py-3 rounded-xl font-['Almarai'] transition-all ${
                            selectedDiscount.type === "fixed"
                              ? "bg-cyan-400 text-[#00373a]"
                              : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce]"
                          }`}
                        >
                          مبلغ ثابت ر.س
                        </button>
                      </div>
                      {customValue && parseFloat(customValue) > 0 && (
                        <div className="bg-gradient-to-r from-[rgba(34,211,238,0.1)] to-[rgba(0,99,153,0.1)] border border-cyan-400/30 rounded-xl p-3 text-center">
                          <p
                            className="text-sm text-[#c2c7ce] font-['Almarai']"
                            dir="auto"
                          >
                            قيمة الخصم
                          </p>
                          <p className="text-xl font-['Arial'] font-bold text-[#99f0ff]">
                            -
                            {calculateDiscountAmount(
                              selectedDiscount,
                              parseFloat(customValue)
                            ).toFixed(2)}{" "}
                            ر.س
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Apply Button */}
                <button
                  onClick={handleApply}
                  disabled={
                    !selectedDiscount ||
                    (selectedDiscount.id === "d10" && !customValue)
                  }
                  className={`w-full py-4 rounded-2xl font-['Almarai'] font-bold text-lg transition-all ${
                    selectedDiscount &&
                    (selectedDiscount.id !== "d10" || customValue)
                      ? "bg-gradient-to-b from-[#22d3ee] to-[#006399] text-[#00373a] hover:opacity-90 shadow-lg"
                      : "bg-[rgba(255,255,255,0.05)] text-[#c2c7ce] opacity-50 cursor-not-allowed"
                  }`}
                >
                  <span dir="auto">تطبيق الخصم</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
