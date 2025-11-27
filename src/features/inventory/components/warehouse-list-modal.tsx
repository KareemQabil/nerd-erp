/**
 * Warehouse List Modal
 * View and manage all warehouses
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Warehouse as WarehouseIcon,
  Plus,
  Edit,
  MapPin,
  Package,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import type { Warehouse } from "../types/inventory.types";

interface WarehouseListModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouses: Warehouse[];
  onAddWarehouse: () => void;
  onEditWarehouse: (warehouse: Warehouse) => void;
}

export function WarehouseListModal({
  isOpen,
  onClose,
  warehouses,
  onAddWarehouse,
  onEditWarehouse,
}: WarehouseListModalProps) {
  if (!isOpen) return null;

  const getUsagePercentage = (warehouse: Warehouse) => {
    return (warehouse.used / warehouse.capacity) * 100;
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-400";
    if (percentage >= 70) return "text-orange-400";
    return "text-green-400";
  };

  const getUsageBarColor = (percentage: number) => {
    if (percentage >= 90) return "from-red-400 to-red-600";
    if (percentage >= 70) return "from-orange-400 to-orange-600";
    return "from-green-400 to-green-600";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-8"
      dir="rtl"
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
        className="relative w-full max-w-5xl max-h-[calc(100vh-128px)] bg-[#2a2d32] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(255,255,255,0.1)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[rgba(139,92,246,0.2)] to-[rgba(124,58,237,0.1)] border border-purple-400/30 flex items-center justify-center">
              <WarehouseIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-['Almarai'] font-bold text-[#e2e2e6]">
                إدارة المستودعات
              </h2>
              <p className="text-sm text-[#c2c7ce] font-['Almarai']">
                {warehouses.length} مستودع
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onAddWarehouse}
              className="px-4 py-2 rounded-xl bg-linear-to-b from-purple-400 to-purple-600 text-white hover:opacity-90 shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="font-['Almarai'] font-bold">مستودع جديد</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] transition-all"
            >
              <X className="w-5 h-5 text-[#c2c7ce]" />
            </button>
          </div>
        </div>

        {/* Stats Bar - Fixed */}
        <div className="px-6 py-4 bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.1)] shrink-0">
          <div className="grid grid-cols-4 gap-4">
            <div className="p-3 rounded-xl bg-linear-to-br from-[rgba(139,92,246,0.1)] to-[rgba(124,58,237,0.05)] border border-purple-400/20">
              <p className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1">
                إجمالي المستودعات
              </p>
              <p className="text-2xl font-['Arial'] font-bold text-purple-400">
                {warehouses.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-linear-to-br from-[rgba(34,211,238,0.1)] to-[rgba(0,99,153,0.05)] border border-cyan-400/20">
              <p className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1">
                السعة الإجمالية
              </p>
              <p className="text-2xl font-['Arial'] font-bold text-cyan-400">
                {warehouses
                  .reduce((sum, w) => sum + w.capacity, 0)
                  .toLocaleString("ar-SA")}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-linear-to-br from-[rgba(245,158,11,0.1)] to-[rgba(217,119,6,0.05)] border border-orange-400/20">
              <p className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1">
                المستخدم
              </p>
              <p className="text-2xl font-['Arial'] font-bold text-orange-400">
                {warehouses
                  .reduce((sum, w) => sum + w.used, 0)
                  .toLocaleString("ar-SA")}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-linear-to-br from-[rgba(16,185,129,0.1)] to-[rgba(5,150,105,0.05)] border border-green-400/20">
              <p className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1">
                المتاح
              </p>
              <p className="text-2xl font-['Arial'] font-bold text-green-400">
                {warehouses
                  .reduce((sum, w) => sum + (w.capacity - w.used), 0)
                  .toLocaleString("ar-SA")}
              </p>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {warehouses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warehouses.map((warehouse, index) => {
                const usagePercentage = getUsagePercentage(warehouse);
                return (
                  <motion.div
                    key={warehouse.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-5 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] hover:border-purple-400/30 transition-all group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[rgba(139,92,246,0.2)] to-[rgba(124,58,237,0.1)] border border-purple-400/30 flex items-center justify-center shrink-0">
                          <WarehouseIcon className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-['Almarai'] font-bold text-[#e2e2e6] truncate">
                              {warehouse.name}
                            </h3>
                            {warehouse.isDefault && (
                              <div className="px-2 py-0.5 rounded-md bg-cyan-400/20 border border-cyan-400/30 flex items-center gap-1 shrink-0">
                                <CheckCircle className="w-3 h-3 text-cyan-400" />
                                <span className="text-xs font-['Almarai'] text-cyan-400">
                                  افتراضي
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-[#c2c7ce] shrink-0" />
                            <p className="text-xs font-['Almarai'] text-[#c2c7ce] truncate">
                              {warehouse.location}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => onEditWarehouse(warehouse)}
                        className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] opacity-0 group-hover:opacity-100 hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] transition-all shrink-0"
                      >
                        <Edit className="w-4 h-4 text-[#c2c7ce]" />
                      </button>
                    </div>

                    {/* Usage Stats */}
                    <div className="space-y-3">
                      {/* Usage Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                            معدل الاستخدام
                          </span>
                          <span
                            className={`text-sm font-['Arial'] font-bold ${getUsageColor(
                              usagePercentage
                            )}`}
                          >
                            {usagePercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-l ${getUsageBarColor(
                              usagePercentage
                            )} transition-all`}
                            style={{
                              width: `${Math.min(usagePercentage, 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-2 rounded-lg bg-[rgba(255,255,255,0.03)]">
                          <div className="flex items-center gap-1 mb-1">
                            <Package className="w-3 h-3 text-cyan-400" />
                            <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                              السعة
                            </span>
                          </div>
                          <p className="text-sm font-['Arial'] font-bold text-[#e2e2e6]">
                            {warehouse.capacity.toLocaleString("ar-SA")}
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-[rgba(255,255,255,0.03)]">
                          <div className="flex items-center gap-1 mb-1">
                            <TrendingUp className="w-3 h-3 text-orange-400" />
                            <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                              مستخدم
                            </span>
                          </div>
                          <p className="text-sm font-['Arial'] font-bold text-[#e2e2e6]">
                            {warehouse.used.toLocaleString("ar-SA")}
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-[rgba(255,255,255,0.03)]">
                          <div className="flex items-center gap-1 mb-1">
                            <Package className="w-3 h-3 text-green-400" />
                            <span className="text-xs font-['Almarai'] text-[#c2c7ce]">
                              متاح
                            </span>
                          </div>
                          <p className="text-sm font-['Arial'] font-bold text-[#e2e2e6]">
                            {(
                              warehouse.capacity - warehouse.used
                            ).toLocaleString("ar-SA")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <WarehouseIcon className="w-16 h-16 text-[#c2c7ce] opacity-50 mx-auto mb-4" />
                <p className="text-[#c2c7ce] font-['Almarai'] mb-4">
                  لا توجد مستودعات
                </p>
                <button
                  onClick={onAddWarehouse}
                  className="px-6 py-3 rounded-xl bg-linear-to-b from-purple-400 to-purple-600 text-white hover:opacity-90 shadow-lg transition-all flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-['Almarai'] font-bold">
                    إضافة مستودع جديد
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
