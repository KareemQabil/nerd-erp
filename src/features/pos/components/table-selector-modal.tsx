import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Table } from '../types/pos.types';
import { TableService } from '../services/pos.service';
import { X, Users, Clock, DollarSign } from 'lucide-react';
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
  const [filter, setFilter] = useState<'all' | 'available'>('all');

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

  const getStatusIcon = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return '✓';
      case 'occupied':
        return '●';
      case 'reserved':
        return '◉';
      case 'cleaning':
        return '◌';
      default:
        return '';
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

  const filteredTables = filter === 'available' 
    ? tables.filter(t => t.status === 'available')
    : tables;

  const groupedTables = filteredTables.reduce((acc, table) => {
    const zone = table.zone || 'other';
    if (!acc[zone]) acc[zone] = [];
    acc[zone].push(table);
    return acc;
  }, {} as Record<string, Table[]>);

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
              className="bg-gradient-to-b from-[#1a1c1e] via-[#1d2222] to-[#2a2f35] rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)]">
                <div>
                  <h2 className="text-2xl font-['Almarai'] font-bold text-[#e2e2e6] mb-1" dir="auto">
                    {t('pos.selectTable')}
                  </h2>
                  <p className="text-sm text-[#c2c7ce] font-['Almarai']" dir="auto">
                    اختر طاولة لهذا الطلب
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  <X className="w-6 h-6 text-[#c2c7ce]" />
                </button>
              </div>

              {/* Filter */}
              <div className="p-6 border-b border-[rgba(255,255,255,0.1)]">
                <div className="flex gap-3">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-2 rounded-xl font-['Almarai'] transition-all ${
                      filter === 'all'
                        ? 'bg-cyan-400 text-[#00373a]'
                        : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/50'
                    }`}
                  >
                    <span dir="auto">جميع الطاولات</span>
                  </button>
                  <button
                    onClick={() => setFilter('available')}
                    className={`px-6 py-2 rounded-xl font-['Almarai'] transition-all ${
                      filter === 'available'
                        ? 'bg-cyan-400 text-[#00373a]'
                        : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/50'
                    }`}
                  >
                    <span dir="auto">الطاولات المتاحة فقط</span>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-[calc(90vh-250px)] overflow-y-auto">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-sm text-[#c2c7ce] font-['Almarai']" dir="auto">
                      {t('common.loading')}
                    </p>
                  </div>
                ) : (
                  Object.entries(groupedTables).map(([zone, zoneTables]) => (
                    <div key={zone}>
                      {/* Zone Header */}
                      <h3 className="text-lg font-['Almarai'] font-bold text-[#e2e2e6] mb-3 capitalize" dir="auto">
                        {zone === 'indoor' ? 'داخلي' : zone === 'outdoor' ? 'خارجي' : zone === 'vip' ? 'VIP' : zone}
                      </h3>

                      {/* Tables Grid */}
                      <div className="grid grid-cols-4 gap-3">
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
                                ? 'bg-gradient-to-b from-[rgba(16,185,129,0.2)] to-[rgba(5,150,105,0.2)] border border-[#10b981] hover:border-[#22d3ee] cursor-pointer'
                                : table.status === 'occupied'
                                ? 'bg-gradient-to-b from-[rgba(239,68,68,0.2)] to-[rgba(220,38,38,0.2)] border border-[#ef4444] cursor-not-allowed opacity-70'
                                : table.status === 'reserved'
                                ? 'bg-gradient-to-b from-[rgba(245,158,11,0.2)] to-[rgba(217,119,6,0.2)] border border-[#f59e0b] cursor-not-allowed opacity-70'
                                : 'bg-gradient-to-b from-[rgba(107,114,128,0.2)] to-[rgba(75,85,99,0.2)] border border-[#6b7280] cursor-not-allowed opacity-70'
                            }`}
                          >
                            {/* Status Badge */}
                            <div className={`absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-b ${getStatusColor(table.status)}`} />

                            {/* Table Number */}
                            <div className="text-center mb-2">
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
                                <>
                                  {table.currentBill && (
                                    <div className="flex items-center justify-center gap-1 text-xs text-[#ef4444]">
                                      <DollarSign className="w-3 h-3" />
                                      <span className="font-['Arial']">{table.currentBill.toFixed(0)}</span>
                                    </div>
                                  )}
                                  {table.startTime && (
                                    <div className="flex items-center justify-center gap-1 text-xs text-[#f59e0b]">
                                      <Clock className="w-3 h-3" />
                                      <span className="font-['Arial']">{formatDuration(table.startTime)}</span>
                                    </div>
                                  )}
                                </>
                              )}

                              {/* Status Label */}
                              <div className="text-xs font-['Almarai'] text-center mt-1" dir="auto">
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
