import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type {
  CartItem,
  PaymentMethod,
  OrderType,
  Customer,
  Table,
  Discount,
  BillSplit,
} from "../types/pos.types";
import {
  X,
  Check,
  CreditCard,
  Banknote,
  Smartphone,
  Wallet,
  Printer,
  ChefHat,
  Scissors,
  ArrowLeft,
  Receipt,
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
    change?: number,
    split?: BillSplit
  ) => void;
  onPrintReceipt: () => void;
  onSendToKitchen: () => void;
}

type PaymentStep = "review" | "split" | "payment" | "complete";

const PAYMENT_METHODS: {
  id: PaymentMethod;
  name: string;
  nameEn: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    id: "cash",
    name: "نقدي",
    nameEn: "Cash",
    icon: <Banknote className="w-8 h-8" />,
    color: "from-[#10b981] to-[#059669]",
  },
  {
    id: "visa",
    name: "فيزا",
    nameEn: "Visa",
    icon: <CreditCard className="w-8 h-8" />,
    color: "from-[#3b82f6] to-[#2563eb]",
  },
  {
    id: "mada",
    name: "مدى",
    nameEn: "Mada",
    icon: <CreditCard className="w-8 h-8" />,
    color: "from-[#22d3ee] to-[#0891b2]",
  },
  {
    id: "stcpay",
    name: "STC Pay",
    nameEn: "STC Pay",
    icon: <Smartphone className="w-8 h-8" />,
    color: "from-[#a855f7] to-[#7c3aed]",
  },
  {
    id: "tabby",
    name: "تابي",
    nameEn: "Tabby",
    icon: <Wallet className="w-8 h-8" />,
    color: "from-[#f59e0b] to-[#d97706]",
  },
  {
    id: "tamara",
    name: "تمارا",
    nameEn: "Tamara",
    icon: <Wallet className="w-8 h-8" />,
    color: "from-[#ec4899] to-[#db2777]",
  },
];

const QUICK_CASH_AMOUNTS = [50, 100, 200, 500];

export function PaymentModal({
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
  onPrintReceipt,
  onSendToKitchen,
}: PaymentModalProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<PaymentStep>("review");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [cashAmount, setCashAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitType, setSplitType] = useState<"equal" | "by-item" | null>(null);
  const [splitPeople, setSplitPeople] = useState<number>(2);
  const [billSplit, setBillSplit] = useState<BillSplit | null>(null);

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    if (method !== "cash") {
      // For non-cash payments, process immediately
      handlePayment(method);
    }
  };

  const handlePayment = async (method: PaymentMethod) => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (method === "cash") {
      const amount = parseFloat(cashAmount) || 0;
      const change = amount - total;
      if (amount >= total) {
        onPaymentComplete(method, amount, change, billSplit || undefined);
        setCurrentStep("complete");
      }
    } else {
      onPaymentComplete(method, total, undefined, billSplit || undefined);
      setCurrentStep("complete");
    }

    setIsProcessing(false);
  };

  const handleSplitEqual = () => {
    const perPerson = total / splitPeople;
    const split: BillSplit = {
      id: `split-${Date.now()}`,
      type: "equal",
      totalAmount: total,
      parts: Array.from({ length: splitPeople }, (_, i) => ({
        id: `part-${i + 1}`,
        person: `شخص ${i + 1}`,
        amount: perPerson,
        items: items,
        paid: false,
      })),
    };
    setBillSplit(split);
    setCurrentStep("payment");
  };

  const handleSplitByItem = () => {
    // Simple by-item split - each person gets their own items
    const perPerson = total / items.length;
    const split: BillSplit = {
      id: `split-${Date.now()}`,
      type: "by_item",
      totalAmount: total,
      parts: items.map((item, i) => ({
        id: `part-${i + 1}`,
        person: `شخص ${i + 1}`,
        amount: item.total + item.total * 0.15, // Including tax
        items: [item],
        paid: false,
      })),
    };
    setBillSplit(split);
    setCurrentStep("payment");
  };

  const calculateChange = () => {
    const amount = parseFloat(cashAmount) || 0;
    return Math.max(0, amount - total);
  };

  const canCompleteCashPayment = () => {
    const amount = parseFloat(cashAmount) || 0;
    return amount >= total;
  };

  const handleClose = () => {
    // Reset state
    setCurrentStep("review");
    setSelectedMethod(null);
    setCashAmount("");
    setSplitType(null);
    setBillSplit(null);
    onClose();
  };

  const renderReviewStep = () => (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="bg-[rgba(255,255,255,0.03)] rounded-2xl p-4 border border-[rgba(255,255,255,0.1)]">
        <h3
          className="text-lg font-['Almarai'] font-bold text-[#e2e2e6] mb-3"
          dir="auto"
        >
          ملخص الطلب
        </h3>

        {/* Items */}
        <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.05)]"
            >
              <div className="flex-1">
                <p
                  className="text-sm font-['Almarai'] text-[#e2e2e6]"
                  dir="auto"
                >
                  {item.product.name}
                </p>
                {item.modifiers && item.modifiers.length > 0 && (
                  <p
                    className="text-xs text-[#c2c7ce] font-['Almarai']"
                    dir="auto"
                  >
                    {item.modifiers.map((m) => m.name).join(", ")}
                  </p>
                )}
              </div>
              <div className="text-right mr-4">
                <p className="text-sm font-['Arial'] text-[#c2c7ce]">
                  ×{item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-['Arial'] font-bold text-[#e2e2e6]">
                  {item.total.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Info */}
        <div className="space-y-2 pt-3 border-t border-[rgba(255,255,255,0.1)]">
          <div className="flex justify-between text-sm">
            <span className="font-['Almarai'] text-[#c2c7ce]" dir="auto">
              نوع الطلب:
            </span>
            <span className="font-['Almarai'] text-[#e2e2e6]" dir="auto">
              {orderType === "dineIn"
                ? "في المطعم"
                : orderType === "takeaway"
                ? "سفري"
                : "توصيل"}
            </span>
          </div>
          {table && (
            <div className="flex justify-between text-sm">
              <span className="font-['Almarai'] text-[#c2c7ce]" dir="auto">
                الطاولة:
              </span>
              <span className="font-['Almarai'] text-[#e2e2e6]" dir="auto">
                {table.name}
              </span>
            </div>
          )}
          {customer && (
            <div className="flex justify-between text-sm">
              <span className="font-['Almarai'] text-[#c2c7ce]" dir="auto">
                العميل:
              </span>
              <span className="font-['Almarai'] text-[#e2e2e6]" dir="auto">
                {customer.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Totals */}
      <div className="bg-gradient-to-r from-[rgba(34,211,238,0.1)] to-[rgba(0,99,153,0.1)] border border-cyan-400/30 rounded-2xl p-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span
              className="text-sm font-['Almarai'] text-[#c2c7ce]"
              dir="auto"
            >
              المجموع الفرعي:
            </span>
            <span className="text-sm font-['Arial'] text-[#e2e2e6]">
              {subtotal.toFixed(2)} ر.س
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span
                className="text-sm font-['Almarai'] text-[#c2c7ce]"
                dir="auto"
              >
                الخصم{" "}
                {appliedDiscount ? `(${appliedDiscount.discount.name})` : ""}:
              </span>
              <span className="text-sm font-['Arial'] text-green-400">
                -{discount.toFixed(2)} ر.س
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span
              className="text-sm font-['Almarai'] text-[#c2c7ce]"
              dir="auto"
            >
              الضريبة (15%):
            </span>
            <span className="text-sm font-['Arial'] text-[#e2e2e6]">
              {tax.toFixed(2)} ر.س
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-cyan-400/30">
            <span
              className="font-['Almarai'] font-bold text-[#e2e2e6]"
              dir="auto"
            >
              الإجمالي:
            </span>
            <span className="text-2xl font-['Arial'] font-bold text-[#99f0ff]">
              {total.toFixed(2)} ر.س
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setCurrentStep("split")}
          className="py-4 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] hover:border-cyan-400/50 transition-all flex items-center justify-center gap-2"
        >
          <Scissors className="w-5 h-5" />
          <span className="font-['Almarai']" dir="auto">
            تقسيم الفاتورة
          </span>
        </button>
        <button
          onClick={() => setCurrentStep("payment")}
          className="py-4 rounded-2xl bg-gradient-to-b from-[#22d3ee] to-[#006399] text-[#00373a] hover:opacity-90 shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Receipt className="w-5 h-5" />
          <span className="font-['Almarai'] font-bold" dir="auto">
            متابعة للدفع
          </span>
        </button>
      </div>
    </div>
  );

  const renderSplitStep = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentStep("review")}
        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-['Almarai']" dir="auto">
          رجوع
        </span>
      </button>

      <div>
        <h3
          className="text-lg font-['Almarai'] font-bold text-[#e2e2e6] mb-4"
          dir="auto"
        >
          اختر طريقة التقسيم
        </h3>

        <div className="space-y-3">
          {/* Equal Split */}
          <button
            onClick={() => setSplitType("equal")}
            className={`w-full p-4 rounded-2xl border transition-all ${
              splitType === "equal"
                ? "bg-cyan-400/20 border-cyan-400"
                : "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] hover:border-cyan-400/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p
                  className="font-['Almarai'] font-bold text-[#e2e2e6] mb-1"
                  dir="auto"
                >
                  تقسيم متساوي
                </p>
                <p
                  className="text-sm font-['Almarai'] text-[#c2c7ce]"
                  dir="auto"
                >
                  تقسيم المبلغ بالتساوي بين الأشخاص
                </p>
              </div>
              <Scissors className="w-6 h-6 text-cyan-400" />
            </div>
          </button>

          {splitType === "equal" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-[rgba(255,255,255,0.03)] rounded-xl p-4"
            >
              <p
                className="text-sm font-['Almarai'] text-[#c2c7ce] mb-3"
                dir="auto"
              >
                عدد الأشخاص:
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSplitPeople(num)}
                    className={`py-3 rounded-xl font-['Arial'] font-bold transition-all ${
                      splitPeople === num
                        ? "bg-gradient-to-b from-[#22d3ee] to-[#006399] text-[#00373a]"
                        : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] hover:border-cyan-400/50"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="mt-4 p-3 bg-cyan-400/10 rounded-lg">
                <p
                  className="text-sm font-['Almarai'] text-[#c2c7ce] text-center"
                  dir="auto"
                >
                  كل شخص يدفع:{" "}
                  <span className="text-lg font-['Arial'] font-bold text-cyan-400">
                    {(total / splitPeople).toFixed(2)} ر.س
                  </span>
                </p>
              </div>
              <button
                onClick={handleSplitEqual}
                className="w-full mt-3 py-3 rounded-xl bg-gradient-to-b from-[#22d3ee] to-[#006399] text-[#00373a] font-['Almarai'] font-bold hover:opacity-90"
              >
                <span dir="auto">تأكيد التقسيم</span>
              </button>
            </motion.div>
          )}

          {/* By Item Split */}
          <button
            onClick={() => setSplitType("by-item")}
            className={`w-full p-4 rounded-2xl border transition-all ${
              splitType === "by-item"
                ? "bg-cyan-400/20 border-cyan-400"
                : "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] hover:border-cyan-400/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p
                  className="font-['Almarai'] font-bold text-[#e2e2e6] mb-1"
                  dir="auto"
                >
                  تقسيم حسب المنتجات
                </p>
                <p
                  className="text-sm font-['Almarai'] text-[#c2c7ce]"
                  dir="auto"
                >
                  كل شخص يدفع ثمن منتجاته
                </p>
              </div>
              <Receipt className="w-6 h-6 text-cyan-400" />
            </div>
          </button>

          {splitType === "by-item" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-[rgba(255,255,255,0.03)] rounded-xl p-4"
            >
              <button
                onClick={handleSplitByItem}
                className="w-full py-3 rounded-xl bg-gradient-to-b from-[#22d3ee] to-[#006399] text-[#00373a] font-['Almarai'] font-bold hover:opacity-90"
              >
                <span dir="auto">تأكيد التقسيم</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      {billSplit && (
        <button
          onClick={() => setCurrentStep("split")}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-['Almarai']" dir="auto">
            رجوع
          </span>
        </button>
      )}

      {/* Total Amount */}
      <div className="bg-gradient-to-r from-[rgba(34,211,238,0.1)] to-[rgba(0,99,153,0.1)] border border-cyan-400/30 rounded-2xl p-6 text-center">
        <p className="text-sm text-[#c2c7ce] font-['Almarai'] mb-2" dir="auto">
          {billSplit ? "المبلغ المطلوب" : t("pos.total")}
        </p>
        <p className="text-4xl font-['Arial'] font-bold text-[#99f0ff]">
          {total.toFixed(2)} ر.س
        </p>
        {billSplit && (
          <p
            className="text-xs text-[#c2c7ce] font-['Almarai'] mt-2"
            dir="auto"
          >
            مقسم على {billSplit.parts.length}{" "}
            {billSplit.parts.length === 2 ? "شخصين" : "أشخاص"}
          </p>
        )}
      </div>

      {/* Payment Methods Grid */}
      <div>
        <p className="text-sm font-['Almarai'] text-[#c2c7ce] mb-3" dir="auto">
          {t("pos.paymentMethods")}
        </p>
        <div className="grid grid-cols-3 gap-3">
          {PAYMENT_METHODS.map((method) => (
            <motion.button
              key={method.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMethodSelect(method.id)}
              disabled={isProcessing}
              className={`relative p-4 rounded-2xl transition-all ${
                selectedMethod === method.id
                  ? `bg-gradient-to-b ${method.color} text-white shadow-lg`
                  : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/50"
              } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex flex-col items-center gap-2">
                {method.icon}
                <span className="text-sm font-['Almarai']" dir="auto">
                  {method.name}
                </span>
              </div>
              {selectedMethod === method.id && (
                <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                  <Check className="w-4 h-4 text-[#00373a]" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Cash Payment Details */}
      {selectedMethod === "cash" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {/* Quick Amounts */}
          <div>
            <p
              className="text-sm font-['Almarai'] text-[#c2c7ce] mb-3"
              dir="auto"
            >
              مبالغ سريعة
            </p>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_CASH_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setCashAmount(amount.toString())}
                  className="py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] font-['Arial'] font-bold hover:border-cyan-400/50 transition-all"
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label
              className="text-sm font-['Almarai'] text-[#c2c7ce] mb-2 block"
              dir="auto"
            >
              {t("pos.amountReceived")}
            </label>
            <input
              type="number"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-2xl font-['Arial'] font-bold text-[#e2e2e6] text-center focus:outline-none focus:border-cyan-400/50 transition-colors"
              dir="ltr"
            />
          </div>

          {/* Change */}
          {cashAmount && parseFloat(cashAmount) >= total && (
            <div className="bg-gradient-to-r from-[rgba(34,211,238,0.1)] to-[rgba(0,99,153,0.1)] border border-cyan-400/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-['Almarai'] text-[#c2c7ce]"
                  dir="auto"
                >
                  {t("pos.change")}
                </span>
                <span className="text-2xl font-['Arial'] font-bold text-[#99f0ff]">
                  {calculateChange().toFixed(2)} ر.س
                </span>
              </div>
            </div>
          )}

          {/* Complete Cash Payment */}
          <button
            onClick={() => handlePayment("cash")}
            disabled={!canCompleteCashPayment() || isProcessing}
            className={`w-full py-4 rounded-2xl font-['Almarai'] font-bold text-lg transition-all ${
              canCompleteCashPayment() && !isProcessing
                ? "bg-gradient-to-b from-[#22d3ee] to-[#006399] text-[#00373a] hover:opacity-90 shadow-lg"
                : "bg-[rgba(255,255,255,0.05)] text-[#c2c7ce] opacity-50 cursor-not-allowed"
            }`}
          >
            <span dir="auto">
              {isProcessing ? t("common.loading") : t("pos.completePayment")}
            </span>
          </button>
        </motion.div>
      )}

      {/* Processing State for Non-Cash */}
      {isProcessing && selectedMethod !== "cash" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
          <p className="text-lg font-['Almarai'] text-[#e2e2e6]" dir="auto">
            جاري معالجة الدفع...
          </p>
        </motion.div>
      )}
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-b from-[#10b981] to-[#059669] flex items-center justify-center"
      >
        <Check className="w-12 h-12 text-white" />
      </motion.div>

      <h3
        className="text-2xl font-['Almarai'] font-bold text-[#e2e2e6] mb-2"
        dir="auto"
      >
        تمت العملية بنجاح
      </h3>
      <p className="text-[#c2c7ce] font-['Almarai'] mb-8" dir="auto">
        تم إتمام عملية الدفع بنجاح
      </p>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => {
            onPrintReceipt();
            handleClose();
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-b from-[#22d3ee] to-[#006399] text-[#00373a] hover:opacity-90 shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Printer className="w-5 h-5" />
          <span className="font-['Almarai'] font-bold" dir="auto">
            طباعة الفاتورة
          </span>
        </button>

        {orderType === "dineIn" && table && (
          <button
            onClick={() => {
              onSendToKitchen();
              handleClose();
            }}
            className="w-full py-4 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] hover:border-cyan-400/50 transition-all flex items-center justify-center gap-2"
          >
            <ChefHat className="w-5 h-5" />
            <span className="font-['Almarai']" dir="auto">
              إرسال للمطبخ
            </span>
          </button>
        )}

        <button
          onClick={handleClose}
          className="w-full py-3 rounded-xl text-[#c2c7ce] hover:text-[#e2e2e6] transition-colors"
        >
          <span className="font-['Almarai']" dir="auto">
            إغلاق
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={currentStep !== "complete" ? handleClose : undefined}
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
                    {currentStep === "review" && "مراجعة الطلب"}
                    {currentStep === "split" && "تقسيم الفاتورة"}
                    {currentStep === "payment" && t("pos.payment")}
                    {currentStep === "complete" && "اكتمل"}
                  </h2>
                  <p
                    className="text-sm text-[#c2c7ce] font-['Almarai']"
                    dir="auto"
                  >
                    {currentStep === "review" && "راجع تفاصيل طلبك قبل الدفع"}
                    {currentStep === "split" && "اختر طريقة تقسيم الفاتورة"}
                    {currentStep === "payment" && t("pos.selectPaymentMethod")}
                    {currentStep === "complete" && "عملية ناجحة"}
                  </p>
                </div>
                {currentStep !== "complete" && (
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  >
                    <X className="w-6 h-6 text-[#c2c7ce]" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                {currentStep === "review" && renderReviewStep()}
                {currentStep === "split" && renderSplitStep()}
                {currentStep === "payment" && renderPaymentStep()}
                {currentStep === "complete" && renderCompleteStep()}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
