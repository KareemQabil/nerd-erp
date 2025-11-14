/**
 * Table Selector Modal - Matching Table Management Design
 * For selecting tables in POS with Open/Close functionality
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from '../types/pos.types';
import { TableService } from '../services/pos.service';
import { X, Users, Clock, DollarSign, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TableSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTable: (table: Table) => void;
  currentTableId?: string;
}

export function TableSelectorModal({ isOpen, onClose, onSelectTable, currentTableId }: TableSelectorModalProps) {
  const { t } = useTranslation();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available'>('available');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadTables();
    }
  }, [isOpen]);

  const loadTables = async () => {
    setLoading(true);
    try {
      const data = await TableService.getTables();
      setTables(data);
    } catch (error) {
      console.error('Error loading tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'from-[#10b981] to-[#059669]';
      case 'occupied':
        return 'from-[#ef4444] to-[#dc2626]';
      case 'reserved':
        return 'from-[#f59e0b] to-[#d97706]';
      case 'cleaning':
        return 'from-[#6b7280] to-[#4b5563]';
      default:
        return 'from-[#42474e] to-[#2a2f35]';
    }
  };

  const formatDuration = (startTime?: Date) => {
    if (!startTime) return '';
    const minutes = Math.floor((Date.now() - startTime.getTime()) / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}س ${mins}د`;
    }
    return `${mins}د`;
  };

  const filteredTables = tables.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = !searchQuery || 
      t.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.zone && t.zone.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const groupedTables = filteredTables.reduce((acc, table) => {
    const zone = table.zone || 'other';
    if (!acc[zone]) acc[zone] = [];
    acc[zone].push(table);
    return acc;
  }, {} as Record<string, Table[]>);

  const stats = {
    total: tables.length,
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
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
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-b from-[#1a1c1e] via-[#1d2222] to-[#2a2f35] rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
              dir="rtl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)]">
                <div>
                  <h2 className="text-2xl font-['Almarai'] font-bold text-[#e2e2e6] mb-1">
                    اختيار الطاولة
                  </h2>
                  <p className="text-sm text-[#c2c7ce] font-['Almarai']">
                    اختر طاولة لبدء الطلب
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  <X className="w-6 h-6 text-[#c2c7ce]" />
                </button>
              </div>

              {/* Stats Bar */}
              <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 bg-[rgba(255,255,255,0.05)] rounded-xl p-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                      <span className="text-lg font-['Arial'] font-bold text-white">{stats.total}</span>
                    </div>
                    <div>
                      <p className="text-xs text-[#c2c7ce] font-['Almarai']">إجمالي</p>
                      <p className="text-sm text-[#e2e2e6] font-['Almarai'] font-bold">الطاولات</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[rgba(16,185,129,0.1)] rounded-xl p-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <span className="text-lg font-['Arial'] font-bold text-white">{stats.available}</span>
                    </div>
                    <div>
                      <p className="text-xs text-[#c2c7ce] font-['Almarai']">طاولات</p>
                      <p className="text-sm text-green-400 font-['Almarai'] font-bold">متاحة</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[rgba(239,68,68,0.1)] rounded-xl p-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                      <span className="text-lg font-['Arial'] font-bold text-white">{stats.occupied}</span>
                    </div>
                    <div>
                      <p className="text-xs text-[#c2c7ce] font-['Almarai']">طاولات</p>
                      <p className="text-sm text-red-400 font-['Almarai'] font-bold">مشغولة</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="p-6 border-b border-[rgba(255,255,255,0.1)] space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                  <input
                    type="text"
                    placeholder="ابحث عن رقم الطاولة أو المنطقة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-12 pl-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Almarai'] placeholder:text-[#6b7280] focus:outline-none focus:border-cyan-400/50 transition-colors"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setFilter('available')}
                    className={`px-6 py-2 rounded-xl font-['Almarai'] font-bold transition-all ${
                      filter === 'available'
                        ? 'bg-cyan-400 text-[#00373a]'
                        : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/50'
                    }`}
                  >
                    المتاحة فقط ({stats.available})
                  </button>
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-2 rounded-xl font-['Almarai'] font-bold transition-all ${
                      filter === 'all'
                        ? 'bg-cyan-400 text-[#00373a]'
                        : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/50'
                    }`}
                  >
                    جميع الطاولات ({stats.total})
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 450px)', paddingBottom: '120px' }}>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-sm text-[#c2c7ce] font-['Almarai']">
                      {t('common.loading')}
                    </p>
                  </div>
                ) : filteredTables.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-[#c2c7ce] font-['Almarai']">
                      لا توجد طاولات متاحة
                    </p>
                  </div>
                ) : (
                  Object.entries(groupedTables).map(([zone, zoneTables]) => (
                    <div key={zone}>
                      {/* Zone Header */}
                      <h3 className="text-lg font-['Almarai'] font-bold text-[#e2e2e6] mb-3 flex items-center gap-2">
                        <div className="w-1 h-6 bg-cyan-400 rounded-full" />
                        {zone === 'indoor' ? 'داخلي' : zone === 'outdoor' ? 'خارجي' : zone === 'vip' ? 'VIP' : zone}
                        <span className="text-sm text-[#6b7280]">({zoneTables.length})</span>
                      </h3>

                      {/* Tables Grid */}
                      <div className="grid grid-cols-5 gap-3">
                        {zoneTables.map((table) => (
                          <motion.button
                            key={table.id}
                            whileHover={{ scale: table.status === 'available' ? 1.05 : 1 }}
                            whileTap={{ scale: table.status === 'available' ? 0.95 : 1 }}
                            onClick={() => {
                              if (table.status === 'available') {
                                onSelectTable(table);
                                onClose();
                              }
                            }}
                            disabled={table.status !== 'available'}
                            className={`relative p-4 rounded-2xl transition-all ${
                              table.id === currentTableId
                                ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#1a1c1e]'
                                : ''
                            } ${
                              table.status === 'available'
                                ? 'bg-gradient-to-b from-[rgba(16,185,129,0.2)] to-[rgba(5,150,105,0.2)] border-2 border-[#10b981] hover:border-cyan-400 cursor-pointer'
                                : table.status === 'occupied'
                                ? 'bg-gradient-to-b from-[rgba(239,68,68,0.2)] to-[rgba(220,38,38,0.2)] border-2 border-[#ef4444] cursor-not-allowed opacity-70'
                                : table.status === 'reserved'
                                ? 'bg-gradient-to-b from-[rgba(245,158,11,0.2)] to-[rgba(217,119,6,0.2)] border-2 border-[#f59e0b] cursor-not-allowed opacity-70'
                                : 'bg-gradient-to-b from-[rgba(107,114,128,0.2)] to-[rgba(75,85,99,0.2)] border-2 border-[#6b7280] cursor-not-allowed opacity-70'
                            }`}
                          >
                            {/* Status Badge */}
                            <div className={`absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-b ${getStatusColor(table.status)}`} />

                            {/* Table Number */}
                            <div className="text-center mb-3">
                              <span className="text-3xl font-['Arial'] font-bold text-[#e2e2e6]">
                                {table.number}
                              </span>
                            </div>

                            {/* Table Info */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-center gap-1 text-xs text-[#c2c7ce]">
                                <Users className="w-3 h-3" />
                                <span className="font-['Arial']">{table.capacity}</span>
                              </div>

                              {table.status === 'occupied' && (
                                <div className="space-y-1">
                                  {table.currentBill && (
                                    <div className="flex items-center justify-center gap-1 text-xs text-[#ef4444]">
                                      <DollarSign className="w-3 h-3" />
                                      <span className="font-['Arial'] font-bold">{table.currentBill.toFixed(0)}</span>
                                    </div>
                                  )}
                                  {table.startTime && (
                                    <div className="flex items-center justify-center gap-1 text-xs text-[#f59e0b]">
                                      <Clock className="w-3 h-3" />
                                      <span className="font-['Arial']">{formatDuration(table.startTime)}</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Status Label */}
                              <div className="text-xs font-['Almarai'] text-center mt-2 pt-2 border-t border-[rgba(255,255,255,0.1)]">
                                {t(`pos.tableStatus.${table.status}`)}
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}