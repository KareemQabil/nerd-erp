/**
 * Kitchen Send Modal
 * Confirms sending order to kitchen with printer simulation
 */

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, UtensilsCrossed, Check, AlertCircle, Printer } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { CartItem, OrderType, Table } from "../types/pos.types";

interface KitchenSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orderType: OrderType;
  table?: Table | null;
}

export function KitchenSendModal({
  isOpen,
  onClose,
  items,
  orderType,
  table,
}: KitchenSendModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [kitchenNotes, setKitchenNotes] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);
  const [printComplete, setPrintComplete] = useState(false);

  const orderNumber = `K${Date.now().toString().slice(-6)}`;
  const currentTime = new Date().toLocaleTimeString(isRTL ? "ar-SA" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  useEffect(() => {
    if (isOpen) {
      setKitchenNotes("");
      setIsPrinting(false);
      setPrintComplete(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getOrderTypeLabel = (type: OrderType) => {
    switch (type) {
      case "dineIn":
        return isRTL ? "تناول في المطعم" : "Dine In";
      case "takeaway":
        return isRTL ? "تيك أواي" : "Take Away";
      case "delivery":
        return isRTL ? "توصيل" : "Delivery";
    }
  };

  const handleSendToKitchen = async () => {
    setIsPrinting(true);
    setPrintComplete(false);

    // Simulate sending to kitchen (print simulation)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsPrinting(false);
    setPrintComplete(true);

    // Wait a moment then complete
    setTimeout(() => {
      setPrintComplete(false);
      setKitchenNotes("");
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-8"
        dir={isRTL ? "rtl" : "ltr"}
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
          className="relative bg-[#2a2d32] w-full max-w-3xl max-h-[calc(100vh-128px)] rounded-2xl shadow-2xl overflow-hidden border border-[rgba(255,255,255,0.1)] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Fixed */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(255,255,255,0.1)] flex-shrink-0">
            <button
              onClick={onClose}
              disabled={isPrinting}
              className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center transition-all disabled:opacity-50"
            >
              <X className="w-5 h-5 text-[#c2c7ce]" />
            </button>
            <div className="text-center">
              <h2 className="text-xl font-['Almarai'] font-bold text-[#e2e2e6]">
                {isRTL ? "إرسال إلى المطبخ" : "Send to Kitchen"}
              </h2>
              <p className="text-sm text-[#c2c7ce] font-['Almarai'] mt-1">
                {isRTL ? `طلب رقم ${orderNumber}#` : `Order #${orderNumber}`}
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#f7931e] flex items-center justify-center">
              <UtensilsCrossed className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="grid grid-cols-5 gap-6">
                {/* Left Column - Notes and Summary */}
                <div className="col-span-2 space-y-5">
                  {/* Kitchen Notes */}
                  <div>
                    <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-3 block">
                      {isRTL ? "ملاحظات خاصة للمطبخ" : "Kitchen Special Notes"}
                    </label>
                    <textarea
                      value={kitchenNotes}
                      onChange={(e) => setKitchenNotes(e.target.value)}
                      disabled={isPrinting || printComplete}
                      placeholder={
                        isRTL
                          ? "مثال: استعجال، طلب مهم، تحضير خاص..."
                          : "Example: urgent, important order, special preparation..."
                      }
                      rows={4}
                      className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Almarai'] placeholder:text-[#6b7280] focus:outline-none focus:border-[#ff6b35]/50 transition-colors resize-none"
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                    <p className="text-xs text-[#6b7280] font-['Almarai'] mt-2">
                      {isRTL
                        ? "ستظهر هذه الملاحظات بشكل بارز في طلب المطبخ"
                        : "These notes will appear prominently on kitchen order"}
                    </p>
                  </div>

                  {/* Order Summary */}
                  <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]">
                    <h3 className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-3">
                      {isRTL ? "ملخص الطلب" : "Order Summary"}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-['Almarai'] text-[#c2c7ce]">
                          {isRTL ? "عدد الأصناف" : "Items Count"}
                        </span>
                        <span className="text-lg font-['Arial'] font-bold text-[#e2e2e6]">
                          {items.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-['Almarai'] text-[#c2c7ce]">
                          {isRTL ? "إجمالي الكمية" : "Total Quantity"}
                        </span>
                        <span className="text-lg font-['Arial'] font-bold text-[#e2e2e6]">
                          {items.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Warning Notice */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(245,158,11,0.1)] to-[rgba(217,119,6,0.05)] border border-orange-400/20">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertCircle className="w-5 h-5 text-orange-400" />
                      </div>
                      <p className="text-xs font-['Almarai'] text-orange-300 leading-relaxed">
                        {isRTL
                          ? "سيتم تتبع الطلب مباشرة في المطبخ. تأكد من صحة التفاصيل قبل الإرسال"
                          : "Order will be tracked directly in kitchen. Verify details before sending"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Order Display */}
                <div className="col-span-3">
                  <div className="p-5 rounded-xl bg-white border-2 border-[rgba(255,255,255,0.1)]">
                    {/* Order Code Display */}
                    <div className="mb-5">
                      <div className="p-6 rounded-xl bg-black flex flex-col items-center justify-center">
                        <h1 className="text-4xl font-['Arial'] font-bold text-white mb-2">
                          {orderNumber}#
                        </h1>
                        <p className="text-sm font-['Arial'] text-white/70">
                          {currentTime}
                        </p>
                      </div>
                    </div>

                    {/* Order Type */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <span className="text-sm font-['Almarai'] text-gray-600">
                        {isRTL ? "النوع:" : "Type:"}
                      </span>
                      <span className="text-sm font-['Almarai'] font-bold text-gray-900">
                        {getOrderTypeLabel(orderType)}
                      </span>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-xl border-2 border-gray-900"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-['Arial'] font-bold text-white">
                                  {item.quantity}x
                                </span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-['Almarai'] font-bold text-gray-900">
                                  {isRTL
                                    ? item.product.name
                                    : item.product.nameEn || item.product.name}
                                </h4>
                                {item.modifiers &&
                                  item.modifiers.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                      {item.modifiers.map((mod, modIndex) => (
                                        <div
                                          key={modIndex}
                                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-100 border border-yellow-300 mr-1"
                                        >
                                          <span className="text-xs font-['Almarai'] text-yellow-900">
                                            ✓
                                          </span>
                                          <span className="text-xs font-['Almarai'] font-bold text-yellow-900">
                                            {isRTL
                                              ? mod.name
                                              : mod.nameEn || mod.name}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                {item.notes && (
                                  <p className="text-xs font-['Almarai'] text-gray-600 mt-2">
                                    {item.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="px-6 py-4 border-t border-[rgba(255,255,255,0.1)] flex gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              disabled={isPrinting || printComplete}
              className="flex-1 px-6 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] font-['Almarai'] font-bold transition-all disabled:opacity-50"
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </button>
            <button
              onClick={handleSendToKitchen}
              disabled={isPrinting || printComplete}
              className="flex-1 px-6 py-3 rounded-xl font-['Almarai'] font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
              style={{
                background: printComplete
                  ? "linear-gradient(to bottom, #10b981, #059669)"
                  : "linear-gradient(to bottom, #ff6b35, #f7931e)",
              }}
            >
              {printComplete ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>
                    {isRTL ? "تم الإرسال بنجاح" : "Sent Successfully"}
                  </span>
                </>
              ) : isPrinting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Printer className="w-5 h-5" />
                  </motion.div>
                  <span>{isRTL ? "جاري الإرسال..." : "Sending..."}</span>
                </>
              ) : (
                <>
                  <UtensilsCrossed className="w-5 h-5" />
                  <span>{isRTL ? "إرسال إلى المطبخ" : "Send to Kitchen"}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
