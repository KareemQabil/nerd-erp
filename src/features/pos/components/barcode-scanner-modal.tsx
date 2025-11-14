import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Barcode, Search } from 'lucide-react';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

export function BarcodeScannerModal({
  isOpen,
  onClose,
  onScan,
}: BarcodeScannerModalProps) {
  const [barcode, setBarcode] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setBarcode('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcode.trim()) {
      onScan(barcode.trim());
      setBarcode('');
      onClose();
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
            className="fixed inset-0 bg-black/40 z-100"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--surface)] rounded-2xl shadow-2xl z-100 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[var(--surface-variant)] border-b border-[var(--outline-variant)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center">
                  <Barcode className="w-5 h-5 text-[var(--on-primary)]" />
                </div>
                <h2 className="text-xl font-['Almarai'] font-bold text-[var(--on-surface)]" dir="auto">
                  مسح الباركود
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl hover:bg-[var(--surface)] transition-colors flex items-center justify-center"
              >
                <X className="w-5 h-5 text-[var(--on-surface-variant)]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Scanner Icon */}
                <div className="flex justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-32 h-32 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center"
                  >
                    <Barcode className="w-16 h-16 text-[var(--primary)]" />
                  </motion.div>
                </div>

                {/* Instructions */}
                <div className="text-center space-y-2">
                  <p className="text-base font-['Almarai'] font-bold text-[var(--on-surface)]" dir="auto">
                    امسح الباركود أو أدخله يدوياً
                  </p>
                  <p className="text-sm text-[var(--on-surface-variant)] font-['Almarai']" dir="auto">
                    استخدم ماسح الباركود أو اكتب الرقم مباشرة
                  </p>
                </div>

                {/* Input */}
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="أدخل رقم الباركود..."
                    className="w-full h-14 px-5 pr-14 bg-[var(--surface-variant)] border-2 border-[var(--outline-variant)] rounded-xl text-lg text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)] font-['Arial'] focus:outline-none focus:border-[var(--primary)] transition-all text-center"
                    dir="ltr"
                  />
                  <Search className="absolute left-5 top-4 w-6 h-6 text-[var(--on-surface-variant)]" />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-[var(--surface-variant)] hover:bg-[var(--outline-variant)] text-[var(--on-surface)] font-['Almarai'] font-bold text-base transition-colors"
                  >
                    <span dir="auto">إلغاء</span>
                  </button>
                  <button
                    type="submit"
                    disabled={!barcode.trim()}
                    className="flex-1 py-3 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] font-['Almarai'] font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span dir="auto">بحث</span>
                  </button>
                </div>
              </form>

              {/* Quick Tips */}
              <div className="mt-6 pt-6 border-t border-[var(--outline-variant)]">
                <p className="text-xs font-['Almarai'] text-[var(--on-surface-variant)] text-center" dir="auto">
                  💡 نصيحة: يمكنك استخدام ماسح الباركود مباشرة دون النقر على الحقل
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
