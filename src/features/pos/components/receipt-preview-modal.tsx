/**
 * Receipt Preview Modal
 * Shows print preview and printing simulation
 */

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Printer, Download, Mail, MessageSquare, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type {
  CartItem,
  Customer,
  Table,
  Discount,
  OrderType,
  PaymentMethod,
} from "../types/pos.types";

interface ReceiptPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment?: {
    method: PaymentMethod;
    amount: number;
    change?: number;
    orderNumber: string;
  } | null;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  orderType: OrderType;
  customer?: Customer | null;
  table?: Table | null;
  appliedDiscount?: { discount: Discount; value: number } | null;
}

export function ReceiptPreviewModal({
  isOpen,
  onClose,
  payment,
  items,
  subtotal,
  tax,
  discount,
  total,
  orderType,
  customer,
  table,
  appliedDiscount,
}: ReceiptPreviewModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [isPrinting, setIsPrinting] = useState(false);
  const [printComplete, setPrintComplete] = useState(false);

  if (!isOpen || !payment) return null;

  const { orderNumber, method, amount, change: paymentChange } = payment;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getOrderTypeLabel = (type: OrderType) => {
    switch (type) {
      case "dineIn":
        return isRTL ? "في المطعم" : "Dine In";
      case "takeaway":
        return isRTL ? "تيك أواي" : "Takeaway";
      case "delivery":
        return isRTL ? "توصيل" : "Delivery";
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      cash: { ar: "نقدي", en: "Cash" },
      visa: { ar: "فيزا", en: "Visa" },
      mada: { ar: "مدى", en: "Mada" },
      stcpay: { ar: "STC Pay", en: "STC Pay" },
      tabby: { ar: "تابي", en: "Tabby" },
      tamara: { ar: "تمارا", en: "Tamara" },
    };
    return isRTL ? labels[method]?.ar || method : labels[method]?.en || method;
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    setPrintComplete(false);

    // Simulate printing process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsPrinting(false);
    setPrintComplete(true);

    // Auto-close after showing success
    setTimeout(() => {
      setPrintComplete(false);
      onClose();
    }, 1500);
  };

  const handleDownload = () => {
    // TODO: Implement PDF download
    console.log("Download receipt as PDF");
  };

  const handleEmail = () => {
    // TODO: Implement email receipt
    console.log("Email receipt");
  };

  const handleSMS = () => {
    // TODO: Implement SMS receipt
    console.log("SMS receipt");
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
          className="relative bg-[#2a2d32] w-full max-w-2xl max-h-[calc(100vh-128px)] rounded-2xl shadow-2xl overflow-hidden border border-[rgba(255,255,255,0.1)] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)]">
            <div>
              <h2
                className="text-xl font-['Almarai'] font-bold text-[#e2e2e6]"
                dir="auto"
              >
                {isRTL ? "معاينة الفاتورة" : "Receipt Preview"}
              </h2>
              <p
                className="text-sm text-[#c2c7ce] font-['Almarai'] mt-1"
                dir="auto"
              >
                {isRTL
                  ? `فاتورة رقم ${orderNumber}`
                  : `Receipt #${orderNumber}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5 text-[#c2c7ce]" />
            </button>
          </div>

          <div
            className="flex gap-6 p-6 overflow-y-auto"
            style={{ maxHeight: "calc(90vh - 180px)" }}
          >
            {/* Receipt Preview */}
            <div className="flex-1">
              <div
                className="bg-white p-8 rounded-xl shadow-lg mx-auto"
                style={{
                  width: "320px",
                  fontFamily: "Almarai, Arial, sans-serif",
                  color: "#000",
                  fontSize: "13px",
                }}
                dir="rtl"
              >
                {/* Header */}
                <div className="text-center mb-4 pb-4 border-b-2 border-dashed border-gray-300">
                  <div className="text-2xl font-bold mb-1">NerdPOS</div>
                  <div className="text-xs leading-relaxed text-gray-700">
                    مطعم الأطعمة الفاخرة
                    <br />
                    الرياض، المملكة العربية السعودية
                    <br />
                    هاتف: 920000000
                    <br />
                    سجل ضريبي: 300000000000003
                  </div>
                </div>

                {/* Order Info */}
                <div className="mb-4 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">رقم الفاتورة:</span>
                    <strong>{orderNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">التاريخ والوقت:</span>
                    <span>{formatDate(new Date())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الكاشير:</span>
                    <span>{customer?.name || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">نوع الطلب:</span>
                    <span>{getOrderTypeLabel(orderType)}</span>
                  </div>
                  {table && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">الطاولة:</span>
                      <span>{table.name}</span>
                    </div>
                  )}
                  {customer && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">العميل:</span>
                        <span>{customer.name}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">الجوال:</span>
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Items */}
                <div className="mb-4">
                  <div className="grid grid-cols-4 gap-2 font-bold text-xs border-t border-b border-gray-300 py-2 mb-2">
                    <div className="col-span-2">المنتج</div>
                    <div className="text-center">الكمية</div>
                    <div className="text-left">الإجمالي</div>
                  </div>
                  {items.map((item, index) => (
                    <div key={index} className="mb-2">
                      <div className="grid grid-cols-4 gap-2 text-xs border-b border-dotted border-gray-200 pb-1">
                        <div className="col-span-2">{item.product.name}</div>
                        <div className="text-center">×{item.quantity}</div>
                        <div className="text-left font-['Inter']">
                          {item.total.toFixed(2)}
                        </div>
                      </div>
                      {item.modifiers && item.modifiers.length > 0 && (
                        <div className="text-xs text-gray-600 mr-2 mt-1">
                          {item.modifiers
                            .map((mod) => `+ ${mod.name}`)
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mb-4 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">المجموع الجزئي:</span>
                    <span className="font-['Inter']">
                      {subtotal.toFixed(2)} ر.س
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>
                        الخصم{" "}
                        {appliedDiscount
                          ? `(${appliedDiscount.discount.name})`
                          : ""}
                        :
                      </span>
                      <span className="font-['Inter']">
                        -{discount.toFixed(2)} ر.س
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      ضريبة القيمة المضافة (15%):
                    </span>
                    <span className="font-['Inter']">{tax.toFixed(2)} ر.س</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t-2 border-gray-300 pt-2 mt-2">
                    <span>الإجمالي:</span>
                    <span className="font-['Inter']">
                      {total.toFixed(2)} ر.س
                    </span>
                  </div>
                </div>

                {/* Payment Info */}
                {payment && (
                  <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">طريقة الدفع:</span>
                      <span className="font-bold">
                        {getPaymentMethodLabel(method)}
                      </span>
                    </div>
                    {method === "cash" && paymentChange !== undefined && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">المبلغ المستلم:</span>
                          <span className="font-['Inter']">
                            {amount.toFixed(2)} ر.س
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">الباقي:</span>
                          <span className="font-['Inter']">
                            {paymentChange.toFixed(2)} ر.س
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Barcode */}
                <div className="text-center my-4 font-mono text-sm tracking-wider">
                  *{orderNumber}*
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-600 border-t-2 border-dashed border-gray-300 pt-4">
                  <p className="font-bold mb-1">شكراً لزيارتكم</p>
                  <p>نسعد بخدمتكم دائماً</p>
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="w-80 space-y-4">
              <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4">
                <h3
                  className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-4"
                  dir="auto"
                >
                  {isRTL ? "خيارات الطباعة" : "Print Options"}
                </h3>

                {/* Print Button */}
                <button
                  onClick={handlePrint}
                  disabled={isPrinting || printComplete}
                  className="w-full h-16 rounded-xl flex items-center justify-center gap-3 transition-all mb-3"
                  style={{
                    background: printComplete
                      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                      : "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
                    opacity: isPrinting ? 0.7 : 1,
                    cursor:
                      isPrinting || printComplete ? "not-allowed" : "pointer",
                  }}
                >
                  {printComplete ? (
                    <>
                      <Check className="w-6 h-6 text-white" />
                      <span
                        className="font-['Almarai'] font-bold text-white"
                        dir="auto"
                      >
                        {isRTL ? "تمت الطباعة بنجاح" : "Printed Successfully"}
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
                        <Printer className="w-6 h-6 text-white" />
                      </motion.div>
                      <span
                        className="font-['Almarai'] font-bold text-white"
                        dir="auto"
                      >
                        {isRTL ? "جاري الطباعة..." : "Printing..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <Printer className="w-6 h-6 text-white" />
                      <span
                        className="font-['Almarai'] font-bold text-white"
                        dir="auto"
                      >
                        {isRTL ? "طباعة الفاتورة" : "Print Receipt"}
                      </span>
                    </>
                  )}
                </button>

                {/* Other Actions */}
                <div className="space-y-2">
                  <button
                    onClick={handleDownload}
                    className="w-full h-12 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] hover:border-cyan-400/50 flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-5 h-5 text-cyan-400" />
                    <span
                      className="text-sm font-['Almarai'] text-[#e2e2e6]"
                      dir="auto"
                    >
                      {isRTL ? "تحميل PDF" : "Download PDF"}
                    </span>
                  </button>

                  <button
                    onClick={handleEmail}
                    className="w-full h-12 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] hover:border-cyan-400/50 flex items-center justify-center gap-2 transition-all"
                  >
                    <Mail className="w-5 h-5 text-cyan-400" />
                    <span
                      className="text-sm font-['Almarai'] text-[#e2e2e6]"
                      dir="auto"
                    >
                      {isRTL ? "إرسال بالبريد" : "Email Receipt"}
                    </span>
                  </button>

                  <button
                    onClick={handleSMS}
                    className="w-full h-12 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] hover:border-cyan-400/50 flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    <span
                      className="text-sm font-['Almarai'] text-[#e2e2e6]"
                      dir="auto"
                    >
                      {isRTL ? "إرسال SMS" : "Send SMS"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="bg-[rgba(34,211,238,0.1)] border border-[rgba(34,211,238,0.2)] rounded-xl p-4">
                <p
                  className="text-xs text-cyan-400 font-['Almarai'] leading-relaxed"
                  dir="auto"
                >
                  {isRTL
                    ? "يمكنك طباعة الفاتورة أو تحميلها أو إرسالها للعميل عبر البريد الإلكتروني أو الرسائل النصية"
                    : "You can print, download, or send the receipt to the customer via email or SMS"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
