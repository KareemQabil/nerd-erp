import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle, RefreshCw, Database } from 'lucide-react';
import { SyncService } from '../core/services/sync.service';

export function SyncStatusIndicator() {
  const [stats, setStats] = useState<{
    totalSales: number;
    totalOrders: number;
    totalInventoryMovements: number;
    syncStatus: 'active' | 'idle';
    lastSyncTime: Date | null;
  } | null>(null);

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadStats();
    
    // Refresh stats every 10 seconds
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    const syncStats = await SyncService.getSyncStats();
    setStats(syncStats);
  };

  if (!stats) return null;

  const getStatusColor = () => {
    switch (stats.syncStatus) {
      case 'active':
        return 'bg-green-500';
      case 'idle':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (stats.syncStatus) {
      case 'active':
        return 'متصل';
      case 'idle':
        return 'جاهز';
      default:
        return 'غير متصل';
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Compact Status Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--outline-variant)] shadow-lg hover:shadow-xl transition-all"
        >
          <div className="relative">
            <Database className="w-5 h-5 text-[var(--primary)]" />
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor()} ${
              stats.syncStatus === 'active' ? 'animate-pulse' : ''
            }`} />
          </div>
          <div className="text-right">
            <p className="text-xs font-['Almarai'] font-bold text-[var(--on-surface)]" dir="auto">
              {getStatusText()}
            </p>
            <p className="text-[10px] text-[var(--on-surface-variant)]">
              مزامنة البيانات
            </p>
          </div>
        </button>

        {/* Details Panel */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 mb-2 w-64 bg-[var(--surface)] border border-[var(--outline-variant)] rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 py-3 bg-[var(--surface-variant)] border-b border-[var(--outline-variant)]">
                <h3 className="text-sm font-['Almarai'] font-bold text-[var(--on-surface)]" dir="auto">
                  حالة المزامنة
                </h3>
                <p className="text-[10px] text-[var(--on-surface-variant)]" dir="auto">
                  تكامل POS + الطلبات + المخزون
                </p>
              </div>

              {/* Stats */}
              <div className="p-4 space-y-3">
                {/* Total Sales */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-['Almarai'] text-[var(--on-surface-variant)]" dir="auto">
                    المبيعات المزامنة
                  </span>
                  <span className="text-xs font-['Arial'] font-bold text-[var(--on-surface)]">
                    {stats.totalSales}
                  </span>
                </div>

                {/* Total Orders */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-['Almarai'] text-[var(--on-surface-variant)]" dir="auto">
                    الطلبات المنشأة
                  </span>
                  <span className="text-xs font-['Arial'] font-bold text-[var(--on-surface)]">
                    {stats.totalOrders}
                  </span>
                </div>

                {/* Inventory Movements */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-['Almarai'] text-[var(--on-surface-variant)]" dir="auto">
                    حركات المخزون
                  </span>
                  <span className="text-xs font-['Arial'] font-bold text-[var(--on-surface)]">
                    {stats.totalInventoryMovements}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--outline-variant)] my-2" />

                {/* Last Sync */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-['Almarai'] text-[var(--on-surface-variant)]" dir="auto">
                    آخر مزامنة
                  </span>
                  <span className="text-[10px] text-[var(--on-surface-variant)]">
                    {stats.lastSyncTime
                      ? new Date(stats.lastSyncTime).toLocaleTimeString('ar-SA', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'لم يتم بعد'}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-[var(--surface-variant)]">
                  {stats.syncStatus === 'active' ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-blue-500" />
                  )}
                  <span className="text-xs font-['Almarai'] text-[var(--on-surface)]" dir="auto">
                    {stats.syncStatus === 'active' ? 'المزامنة نشطة' : 'جاهز للمزامنة'}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="px-4 py-3 bg-[var(--surface-variant)] border-t border-[var(--outline-variant)]">
                <p className="text-[10px] text-[var(--on-surface-variant)] text-center" dir="auto">
                  ✅ البيانات محدثة في الوقت الفعلي
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
