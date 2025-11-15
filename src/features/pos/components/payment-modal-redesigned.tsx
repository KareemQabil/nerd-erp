/**
 * Payment Modal - Redesigned with UX Best Practices
 * Simplified, clear, and efficient payment flow
 */

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type {
  CartItem,
  PaymentMethod,
  OrderType,
  Customer,
  Table,
  Discount,
} from "../types/pos.types";
import {
  X,
  Check,
  CreditCard,
  Banknote,
  Smartphone,
  Wallet,
  ChevronLeft,
  Calculator,
  AlertCircle,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  orderType: OrderType;
  customer?: Customer | null;
  table?: Table | null;
  appliedDiscount?: { discount: Discount; value: number } | null;
  onPaymentComplete: (
    method: PaymentMethod,
    amount: number,
    change?: number
  ) => void;
}

const PAYMENT_METHODS: {
  id: PaymentMethod;
  nameAr: string;
  nameEn: string;
  icon: React.ReactNode;
  gradient: string;
  requiresCashInput: boolean;
}[] = [
  {
    id: "cash",
    nameAr: "نقدي",
    nameEn: "Cash",
    icon: <Banknote className="w-7 h-7" />,
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    requiresCashInput: true,
  },
  {
    id: "mada",
    nameAr: "مدى",
    nameEn: "Mada",
    icon: <CreditCard className="w-7 h-7" />,
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    requiresCashInput: false,
  },
  {
    id: "visa",
    nameAr: "فيزا / ماستركارد",
    nameEn: "Visa / Mastercard",
    icon: <CreditCard className="w-7 h-7" />,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    requiresCashInput: false,
  },
  {
    id: "stcpay",
    nameAr: "STC Pay",
    nameEn: "STC Pay",
    icon: <Smartphone className="w-7 h-7" />,
    gradient: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
    requiresCashInput: false,
  },
  {
    id: "tabby",
    nameAr: "تابي - تقسيط",
    nameEn: "Tabby - Installments",
    icon: <Wallet className="w-7 h-7" />,
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    requiresCashInput: false,
  },
  {
    id: "tamara",
    nameAr: "تمارا - تقسيط",
    nameEn: "Tamara - Installments",
    icon: <Wallet className="w-7 h-7" />,
    gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    requiresCashInput: false,
  },
];

const QUICK_CASH_AMOUNTS = [50, 100, 200, 500];

export function PaymentModalRedesigned({
  isOpen,
  onClose,
  items,
  subtotal,
  tax,
  discount,
  total,
  orderType,
  customer,
  table,
  appliedDiscount,
  onPaymentComplete,
}: PaymentModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [cashInput, setCashInput] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setSelectedMethod(null);
      setCashInput("");
      setIsProcessing(false);
      setPaymentSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedMethodData = PAYMENT_METHODS.find(
    (m) => m.id === selectedMethod
  );
  const cashAmount = parseFloat(cashInput) || 0;
  const change = Math.max(0, cashAmount - total);
  const canPay =
    selectedMethod &&
    (!selectedMethodData?.requiresCashInput || cashAmount >= total);

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    const methodData = PAYMENT_METHODS.find((m) => m.id === method);

    // If non-cash, set amount to exact total
    if (!methodData?.requiresCashInput) {
      setCashInput(total.toFixed(2));
    } else {
      // For cash, clear input to let user enter amount
      setCashInput("");
    }
  };

  const handleQuickCash = (amount: number) => {
    setCashInput(amount.toString());
  };

  const handlePayment = async () => {
    if (!canPay) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1800));

    setIsProcessing(false);
    setPaymentSuccess(true);

    // Complete payment after showing success
    setTimeout(() => {
      onPaymentComplete(
        selectedMethod!,
        cashAmount,
        selectedMethodData?.requiresCashInput ? change : undefined
      );
      onClose();
    }, 1200);
  };

  const handleBack = () => {
    if (selectedMethod) {
      setSelectedMethod(null);
      setCashInput("");
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-6 pb-28"
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
          className="relative w-full max-w-xl max-h-full bg-[#2a2d32] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.1)] flex-shrink-0">
            <div className="flex items-center gap-2">
              {selectedMethod && (
                <button
                  onClick={handleBack}
                  disabled={isProcessing || paymentSuccess}
                  className="w-9 h-9 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center transition-all disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 text-[#c2c7ce]" />
                </button>
              )}
              <div>
                <h2
                  className="text-lg font-['Almarai'] font-bold text-[#e2e2e6]"
                  dir="auto"
                >
                  {isRTL ? "الدفع" : "Payment"}
                </h2>
                <p
                  className="text-xs text-[#c2c7ce] font-['Almarai']"
                  dir="auto"
                >
                  {selectedMethod
                    ? isRTL
                      ? selectedMethodData?.nameAr
                      : selectedMethodData?.nameEn
                    : isRTL
                    ? "اختر طريقة الدفع"
                    : "Choose payment method"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing || paymentSuccess}
              className="w-9 h-9 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center transition-all disabled:opacity-50"
            >
              <X className="w-4 h-4 text-[#c2c7ce]" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto overflow-x-hidden flex-1">
            <div className="p-5">
              <AnimatePresence mode="wait">
                {!selectedMethod ? (
                  // Step 1: Select Payment Method
                  <motion.div
                    key="select-method"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {/* Total Display */}
                    <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 rounded-2xl p-6">
                      <div className="text-center">
                        <p
                          className="text-sm font-['Almarai'] text-cyan-400 mb-2"
                          dir="auto"
                        >
                          {isRTL ? "المبلغ الإجمالي" : "Total Amount"}
                        </p>
                        <div className="text-5xl font-['Inter'] font-bold text-white mb-3">
                          {total.toFixed(2)}{" "}
                          <span className="text-2xl">ر.س</span>
                        </div>
                        <div className="flex items-center justify-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[#c2c7ce] font-['Almarai']"
                              dir="auto"
                            >
                              {isRTL ? "الضريبة:" : "Tax:"}
                            </span>
                            <span className="font-['Inter'] text-[#e2e2e6]">
                              {tax.toFixed(2)} ر.س
                            </span>
                          </div>
                          {discount > 0 && (
                            <div className="flex items-center gap-2">
                              <span
                                className="text-[#c2c7ce] font-['Almarai']"
                                dir="auto"
                              >
                                {isRTL ? "الخصم:" : "Discount:"}
                              </span>
                              <span className="font-['Inter'] text-green-400">
                                -{discount.toFixed(2)} ر.س
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Payment Methods Grid */}
                    <div>
                      <h3
                        className="text-base font-['Almarai'] font-bold text-[#e2e2e6] mb-4"
                        dir="auto"
                      >
                        {isRTL ? "اختر طريقة الدفع" : "Select Payment Method"}
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {PAYMENT_METHODS.map((method) => (
                          <motion.button
                            key={method.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleMethodSelect(method.id)}
                            className="relative h-28 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)] hover:border-cyan-400/50 transition-all group"
                          >
                            <div
                              className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                              style={{ background: method.gradient }}
                            />
                            <div className="relative h-full flex flex-col items-center justify-center gap-2 p-4">
                              <div className="text-white">{method.icon}</div>
                              <span
                                className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] text-center leading-tight"
                                dir="auto"
                              >
                                {isRTL ? method.nameAr : method.nameEn}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  // Step 2: Process Payment
                  <motion.div
                    key="process-payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Method Selected Display */}
                    <div className="relative h-32 rounded-2xl overflow-hidden border-2 border-cyan-400">
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{ background: selectedMethodData?.gradient }}
                      />
                      <div className="relative h-full flex items-center justify-between p-6">
                        <div className="flex items-center gap-4">
                          <div className="text-white">
                            {selectedMethodData?.icon}
                          </div>
                          <div>
                            <p
                              className="text-sm font-['Almarai'] text-[#c2c7ce] mb-1"
                              dir="auto"
                            >
                              {isRTL ? "طريقة الدفع" : "Payment Method"}
                            </p>
                            <p
                              className="text-xl font-['Almarai'] font-bold text-white"
                              dir="auto"
                            >
                              {isRTL
                                ? selectedMethodData?.nameAr
                                : selectedMethodData?.nameEn}
                            </p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p
                            className="text-sm font-['Almarai'] text-[#c2c7ce] mb-1"
                            dir="auto"
                          >
                            {isRTL ? "المبلغ" : "Amount"}
                          </p>
                          <p className="text-3xl font-['Inter'] font-bold text-white">
                            {total.toFixed(2)}{" "}
                            <span className="text-lg">ر.س</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cash Input Section */}
                    {selectedMethodData?.requiresCashInput && (
                      <div className="space-y-4">
                        {/* Quick Cash Buttons */}
                        <div>
                          <label
                            className="block text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-3"
                            dir="auto"
                          >
                            {isRTL ? "مبلغ سريع" : "Quick Amount"}
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {QUICK_CASH_AMOUNTS.map((amount) => (
                              <button
                                key={amount}
                                onClick={() => handleQuickCash(amount)}
                                disabled={isProcessing || paymentSuccess}
                                className="h-14 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] hover:border-cyan-400/50 transition-all disabled:opacity-50"
                              >
                                <span className="font-['Inter'] font-bold text-[#e2e2e6]">
                                  {amount}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Cash Input */}
                        <div>
                          <label
                            className="block text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-3"
                            dir="auto"
                          >
                            {isRTL
                              ? "أدخل المبلغ المستلم"
                              : "Enter Received Amount"}
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={cashInput}
                              onChange={(e) => setCashInput(e.target.value)}
                              disabled={isProcessing || paymentSuccess}
                              placeholder={total.toFixed(2)}
                              className="w-full h-20 px-6 rounded-2xl bg-[rgba(255,255,255,0.05)] border-2 border-[rgba(255,255,255,0.1)] text-[#e2e2e6] placeholder-[#6b7280] focus:border-cyan-400 focus:outline-none font-['Inter'] font-bold text-3xl text-center disabled:opacity-50"
                              dir="ltr"
                              step="0.01"
                              min="0"
                            />
                            <div className="absolute left-6 top-1/2 -translate-y-1/2">
                              <Calculator className="w-6 h-6 text-[#6b7280]" />
                            </div>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2">
                              <span className="text-lg font-['Almarai'] text-[#6b7280]">
                                ر.س
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Change Display */}
                        {cashAmount > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-xl p-4 border ${
                              cashAmount >= total
                                ? "bg-green-500/10 border-green-500/30"
                                : "bg-red-500/10 border-red-500/30"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {cashAmount >= total ? (
                                  <Check className="w-5 h-5 text-green-400" />
                                ) : (
                                  <AlertCircle className="w-5 h-5 text-red-400" />
                                )}
                                <span
                                  className="font-['Almarai'] font-bold"
                                  style={{
                                    color:
                                      cashAmount >= total
                                        ? "#10b981"
                                        : "#ef4444",
                                  }}
                                  dir="auto"
                                >
                                  {isRTL ? "الباقي" : "Change"}
                                </span>
                              </div>
                              <span
                                className="text-2xl font-['Inter'] font-bold"
                                style={{
                                  color:
                                    cashAmount >= total ? "#10b981" : "#ef4444",
                                }}
                              >
                                {cashAmount >= total
                                  ? change.toFixed(2)
                                  : (total - cashAmount).toFixed(2)}{" "}
                                ر.س
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Card/Digital Payment Info */}
                    {!selectedMethodData?.requiresCashInput && (
                      <div className="bg-[rgba(34,211,238,0.1)] border border-[rgba(34,211,238,0.2)] rounded-xl p-4 flex items-start gap-3">
                        <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p
                            className="text-sm font-['Almarai'] font-bold text-cyan-400 mb-1 text-right"
                            dir="auto"
                          >
                            {isRTL ? "دفع إلكتروني" : "Electronic Payment"}
                          </p>
                          <p
                            className="text-xs text-cyan-400/80 font-['Almarai'] leading-relaxed text-right"
                            dir="auto"
                          >
                            {isRTL
                              ? 'اضغط على "إتمام الدفع" وسيتم معالجة الدفع تلقائياً عبر جهاز نقاط البيع'
                              : 'Press "Complete Payment" and the payment will be processed automatically via POS terminal'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Payment Button */}
                    <button
                      onClick={handlePayment}
                      disabled={!canPay || isProcessing || paymentSuccess}
                      className="w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-['Almarai'] font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: paymentSuccess
                          ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                          : canPay
                          ? "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)"
                          : "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                      }}
                    >
                      {paymentSuccess ? (
                        <>
                          <Check className="w-6 h-6" />
                          <span dir="auto">
                            {isRTL ? "تم الدفع بنجاح" : "Payment Successful"}
                          </span>
                        </>
                      ) : isProcessing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <CreditCard className="w-6 h-6" />
                          </motion.div>
                          <span dir="auto">
                            {isRTL ? "جاري المعالجة..." : "Processing..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <Check className="w-6 h-6" />
                          <span dir="auto">
                            {isRTL ? "إتمام الدفع" : "Complete Payment"}
                          </span>
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
