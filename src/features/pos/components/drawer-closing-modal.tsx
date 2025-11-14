/**
 * Drawer Closing Modal (تقفيلة درج)
 * Cash drawer closing/reconciliation at end of shift
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, DollarSign, TrendingUp, TrendingDown, Printer, Check, AlertCircle, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DrawerClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: DrawerClosingData) => void;
  expectedCash: number;
  totalSales: number;
  cashSales: number;
  cardSales: number;
  orderCount: number;
}

export interface DrawerClosingData {
  actualCash: number;
  difference: number;
  notes: string;
  denominations: {
    bills_500: number;
    bills_200: number;
    bills_100: number;
    bills_50: number;
    bills_10: number;
    bills_5: number;
    bills_1: number;
    coins: number;
  };
  timestamp: Date;
}

export function DrawerClosingModal({
  isOpen,
  onClose,
  onComplete,
  expectedCash,
  totalSales,
  cashSales,
  cardSales,
  orderCount
}: DrawerClosingModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [denominations, setDenominations] = useState({
    bills_500: 0,
    bills_200: 0,
    bills_100: 0,
    bills_50: 0,
    bills_10: 0,
    bills_5: 0,
    bills_1: 0,
    coins: 0,
  });

  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  if (!isOpen) return null;

  const calculateActualCash = () => {
    return (
      denominations.bills_500 * 500 +
      denominations.bills_200 * 200 +
      denominations.bills_100 * 100 +
      denominations.bills_50 * 50 +
      denominations.bills_10 * 10 +
      denominations.bills_5 * 5 +
      denominations.bills_1 * 1 +
      denominations.coins
    );
  };

  const actualCash = calculateActualCash();
  const difference = actualCash - expectedCash;
  const isBalanced = Math.abs(difference) < 0.01;

  const handleDenominationChange = (denomination: keyof typeof denominations, value: string) => {
    const numValue = parseInt(value) || 0;
    setDenominations(prev => ({
      ...prev,
      [denomination]: Math.max(0, numValue)
    }));
  };

  const handleComplete = async () => {
    setIsProcessing(true);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const data: DrawerClosingData = {
      actualCash,
      difference,
      notes,
      denominations,
      timestamp: new Date()
    };

    onComplete(data);
    setIsProcessing(false);
    setShowSummary(true);

    // Auto-close after showing summary
    setTimeout(() => {
      setShowSummary(false);
      resetForm();
      onClose();
    }, 3000);
  };

  const resetForm = () => {
    setDenominations({
      bills_500: 0,
      bills_200: 0,
      bills_100: 0,
      bills_50: 0,
      bills_10: 0,
      bills_5: 0,
      bills_1: 0,
      coins: 0,
    });
    setNotes('');
  };

  const denominationFields = [
    { key: 'bills_500' as const, value: 500, label: isRTL ? '500 ريال' : '500 SAR' },
    { key: 'bills_200' as const, value: 200, label: isRTL ? '200 ريال' : '200 SAR' },
    { key: 'bills_100' as const, value: 100, label: isRTL ? '100 ريال' : '100 SAR' },
    { key: 'bills_50' as const, value: 50, label: isRTL ? '50 ريال' : '50 SAR' },
    { key: 'bills_10' as const, value: 10, label: isRTL ? '10 ريال' : '10 SAR' },
    { key: 'bills_5' as const, value: 5, label: isRTL ? '5 ريال' : '5 SAR' },
    { key: 'bills_1' as const, value: 1, label: isRTL ? '1 ريال' : '1 SAR' },
    { key: 'coins' as const, value: 0, label: isRTL ? 'عملات معدنية' : 'Coins' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-8" dir={isRTL ? 'rtl' : 'ltr'}>
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
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-['Almarai'] font-bold text-[#e2e2e6]" dir="auto">
                  {isRTL ? 'تقفيلة درج الكاش' : 'Cash Drawer Closing'}
                </h2>
                <p className="text-sm text-[#c2c7ce] font-['Almarai']" dir="auto">
                  {isRTL ? 'جرد النقدية ومطابقة الدرج' : 'Cash count and reconciliation'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center transition-all disabled:opacity-50"
            >
              <X className="w-5 h-5 text-[#c2c7ce]" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Sales Summary */}
              <div className="space-y-4">
                <h3 className="text-base font-['Almarai'] font-bold text-[#e2e2e6] mb-4" dir="auto">
                  {isRTL ? 'ملخص المبيعات' : 'Sales Summary'}
                </h3>

                {/* Total Sales */}
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-white" />
                    <span className="text-sm font-['Almarai'] text-white/80" dir="auto">
                      {isRTL ? 'إجمالي المبيعات' : 'Total Sales'}
                    </span>
                  </div>
                  <div className="text-3xl font-['Inter'] font-bold text-white">
                    {totalSales.toFixed(2)} <span className="text-lg">ر.س</span>
                  </div>
                </div>

                {/* Cash Sales */}
                <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-['Almarai'] text-[#c2c7ce]" dir="auto">
                      {isRTL ? 'مبيعات نقدية' : 'Cash Sales'}
                    </span>
                    <span className="text-xl font-['Inter'] font-bold text-green-400">
                      {cashSales.toFixed(2)} ر.س
                    </span>
                  </div>
                </div>

                {/* Card Sales */}
                <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-['Almarai'] text-[#c2c7ce]" dir="auto">
                      {isRTL ? 'مبيعات شبكة' : 'Card Sales'}
                    </span>
                    <span className="text-xl font-['Inter'] font-bold text-blue-400">
                      {cardSales.toFixed(2)} ر.س
                    </span>
                  </div>
                </div>

                {/* Order Count */}
                <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-['Almarai'] text-[#c2c7ce]" dir="auto">
                      {isRTL ? 'عدد الطلبات' : 'Orders Count'}
                    </span>
                    <span className="text-xl font-['Inter'] font-bold text-cyan-400">
                      {orderCount}
                    </span>
                  </div>
                </div>

                {/* Expected Cash */}
                <div className="bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.2)] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-['Almarai'] text-amber-400" dir="auto">
                      {isRTL ? 'النقدية المتوقعة' : 'Expected Cash'}
                    </span>
                  </div>
                  <div className="text-2xl font-['Inter'] font-bold text-amber-400">
                    {expectedCash.toFixed(2)} ر.س
                  </div>
                </div>
              </div>

              {/* Center: Cash Count */}
              <div className="space-y-4">
                <h3 className="text-base font-['Almarai'] font-bold text-[#e2e2e6] mb-4" dir="auto">
                  {isRTL ? 'عد النقدية' : 'Cash Count'}
                </h3>

                <div className="space-y-3">
                  {denominationFields.map((field) => (
                    <div key={field.key} className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="text-sm font-['Almarai'] text-[#e2e2e6] mb-1" dir="auto">
                            {field.label}
                          </div>
                          {field.value > 0 && (
                            <div className="text-xs text-[#c2c7ce] font-['Inter']">
                              {denominations[field.key]} × {field.value} = {(denominations[field.key] * field.value).toFixed(2)} ر.س
                            </div>
                          )}
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={denominations[field.key] || ''}
                          onChange={(e) => handleDenominationChange(field.key, e.target.value)}
                          disabled={isProcessing}
                          placeholder="0"
                          className="w-20 h-12 px-3 rounded-lg bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] text-center font-['Inter'] font-bold text-lg focus:border-cyan-400 focus:outline-none disabled:opacity-50"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Result & Notes */}
              <div className="space-y-4">
                <h3 className="text-base font-['Almarai'] font-bold text-[#e2e2e6] mb-4" dir="auto">
                  {isRTL ? 'النتيجة' : 'Result'}
                </h3>

                {/* Actual Cash */}
                <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4">
                  <div className="text-sm font-['Almarai'] text-[#c2c7ce] mb-2" dir="auto">
                    {isRTL ? 'النقدية الفعلية' : 'Actual Cash'}
                  </div>
                  <div className="text-3xl font-['Inter'] font-bold text-[#e2e2e6]">
                    {actualCash.toFixed(2)} <span className="text-lg">ر.س</span>
                  </div>
                </div>

                {/* Difference */}
                <div 
                  className="rounded-xl p-4 border"
                  style={{
                    backgroundColor: isBalanced 
                      ? 'rgba(16, 185, 129, 0.1)' 
                      : difference > 0 
                        ? 'rgba(34, 211, 238, 0.1)'
                        : 'rgba(239, 68, 68, 0.1)',
                    borderColor: isBalanced
                      ? 'rgba(16, 185, 129, 0.3)'
                      : difference > 0
                        ? 'rgba(34, 211, 238, 0.3)'
                        : 'rgba(239, 68, 68, 0.3)'
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isBalanced ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : difference > 0 ? (
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    )}
                    <span 
                      className="text-sm font-['Almarai']"
                      style={{ 
                        color: isBalanced ? '#10b981' : difference > 0 ? '#22d3ee' : '#ef4444' 
                      }}
                      dir="auto"
                    >
                      {isBalanced 
                        ? (isRTL ? 'متوازن ✓' : 'Balanced ✓')
                        : difference > 0 
                          ? (isRTL ? 'فائض' : 'Over')
                          : (isRTL ? 'عجز' : 'Short')
                      }
                    </span>
                  </div>
                  <div 
                    className="text-3xl font-['Inter'] font-bold"
                    style={{ 
                      color: isBalanced ? '#10b981' : difference > 0 ? '#22d3ee' : '#ef4444' 
                    }}
                  >
                    {difference > 0 ? '+' : ''}{difference.toFixed(2)} <span className="text-lg">ر.س</span>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2" dir="auto">
                    {isRTL ? 'ملاحظات' : 'Notes'}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={isProcessing}
                    placeholder={isRTL ? 'اكتب أي ملاحظات إضافية...' : 'Write any additional notes...'}
                    className="w-full h-24 px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] placeholder-[#6b7280] focus:border-cyan-400 focus:outline-none resize-none font-['Almarai']"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                {/* Warning if not balanced */}
                {!isBalanced && actualCash > 0 && (
                  <div className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-xl p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-400 font-['Almarai'] leading-relaxed" dir="auto">
                      {isRTL
                        ? '��وجد فرق في المبلغ. يرجى التحقق من العد مرة أخرى أو إضافة ملاحظة توضيحية.'
                        : 'There is a difference in the amount. Please double-check the count or add an explanatory note.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 p-6 border-t border-[rgba(255,255,255,0.1)]">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 h-14 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] font-['Almarai'] font-bold transition-all disabled:opacity-50"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={handleComplete}
              disabled={isProcessing || actualCash === 0}
              className="flex-1 h-14 rounded-xl flex items-center justify-center gap-3 font-['Almarai'] font-bold text-white transition-all disabled:opacity-50"
              style={{
                background: showSummary
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
              }}
            >
              {showSummary ? (
                <>
                  <Check className="w-6 h-6" />
                  <span dir="auto">{isRTL ? 'تمت التقفيلة بنجاح' : 'Closing Complete'}</span>
                </>
              ) : isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Printer className="w-6 h-6" />
                  </motion.div>
                  <span dir="auto">{isRTL ? 'جاري الحفظ...' : 'Processing...'}</span>
                </>
              ) : (
                <>
                  <Check className="w-6 h-6" />
                  <span dir="auto">{isRTL ? 'إتمام التقفيلة' : 'Complete Closing'}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}