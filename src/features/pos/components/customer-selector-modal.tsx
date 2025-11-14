import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, User, Phone, Mail, Plus, Star } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loyaltyPoints?: number;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface CustomerSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
  onAddCustomer: () => void;
}

export function CustomerSelectorModal({
  isOpen,
  onClose,
  customers,
  selectedCustomer,
  onSelectCustomer,
  onAddCustomer,
}: CustomerSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'gold': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'silver': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'bronze': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-[var(--surface-variant)] text-[var(--on-surface-variant)] border-[var(--outline-variant)]';
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] bg-[var(--surface)] rounded-2xl shadow-2xl z-100 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[var(--surface-variant)] border-b border-[var(--outline-variant)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center">
                  <User className="w-5 h-5 text-[var(--on-primary)]" />
                </div>
                <div>
                  <h2 className="text-xl font-['Almarai'] font-bold text-[var(--on-surface)]" dir="auto">
                    اختيار العميل
                  </h2>
                  <p className="text-sm text-[var(--on-surface-variant)]">
                    {selectedCustomer ? selectedCustomer.name : 'لم يتم اختيار عميل'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl hover:bg-[var(--surface)] transition-colors flex items-center justify-center"
              >
                <X className="w-5 h-5 text-[var(--on-surface-variant)]" />
              </button>
            </div>

            {/* Search & Add */}
            <div className="p-4 space-y-3 border-b border-[var(--outline-variant)]">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم أو رقم الهاتف..."
                  className="w-full h-12 px-4 pr-12 bg-[var(--surface-variant)] border border-[var(--outline-variant)] rounded-xl text-base text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)] font-['Almarai'] focus:outline-none focus:border-[var(--primary)] transition-all"
                  dir="rtl"
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-[var(--on-surface-variant)]" />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onSelectCustomer(null);
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-lg bg-[var(--surface-variant)] hover:bg-[var(--primary)]/10 text-[var(--on-surface)] font-['Almarai'] font-bold text-sm transition-colors"
                >
                  <span dir="auto">بدون عميل</span>
                </button>
                <button
                  onClick={() => {
                    onAddCustomer();
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-lg bg-[var(--primary)] text-[var(--on-primary)] font-['Almarai'] font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  <span dir="auto">إضافة عميل جديد</span>
                </button>
              </div>
            </div>

            {/* Customers List */}
            <div className="overflow-y-auto max-h-[calc(80vh-220px)] p-4">
              {filteredCustomers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-[var(--surface-variant)] flex items-center justify-center mb-3">
                    <User className="w-10 h-10 text-[var(--on-surface-variant)] opacity-50" />
                  </div>
                  <h3 className="text-base font-['Almarai'] font-bold text-[var(--on-surface)] mb-1" dir="auto">
                    لا توجد نتائج
                  </h3>
                  <p className="text-sm font-['Almarai'] text-[var(--on-surface-variant)]" dir="auto">
                    جرب البحث بكلمات مختلفة
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredCustomers.map((customer) => (
                    <motion.div
                      key={customer.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onSelectCustomer(customer);
                        onClose();
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedCustomer?.id === customer.id
                          ? 'bg-[var(--primary)]/10 border-[var(--primary)]'
                          : 'bg-[var(--surface-variant)] border-[var(--outline-variant)] hover:border-[var(--primary)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center">
                            <span className="text-lg font-['Almarai'] font-bold text-[var(--on-primary)]">
                              {customer.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-base font-['Almarai'] font-bold text-[var(--on-surface)]" dir="auto">
                              {customer.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-[var(--on-surface-variant)]" />
                                <span className="text-xs font-['Arial'] text-[var(--on-surface-variant)]">
                                  {customer.phone}
                                </span>
                              </div>
                              {customer.email && (
                                <div className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-[var(--on-surface-variant)]" />
                                  <span className="text-xs text-[var(--on-surface-variant)]">
                                    {customer.email}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {customer.tier && (
                            <div className={`px-3 py-1 rounded-full border text-xs font-['Almarai'] font-bold ${getTierColor(customer.tier)}`}>
                              {customer.tier === 'platinum' && '💎 بلاتيني'}
                              {customer.tier === 'gold' && '🏆 ذهبي'}
                              {customer.tier === 'silver' && '⭐ فضي'}
                              {customer.tier === 'bronze' && '🥉 برونزي'}
                            </div>
                          )}
                          {customer.loyaltyPoints !== undefined && (
                            <div className="flex items-center gap-1 text-[var(--primary)]">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-sm font-['Arial'] font-bold">
                                {customer.loyaltyPoints}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
