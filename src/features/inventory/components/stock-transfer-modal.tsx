/**
 * Stock Transfer Modal
 * Transfer stock between warehouses
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowRightLeft,
  Package,
  Warehouse as WarehouseIcon,
  AlertCircle,
  ArrowRight,
  Save,
} from 'lucide-react';
import { Product, Warehouse } from '../types/inventory.types';

interface StockTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  warehouses: Warehouse[];
  onTransfer: (
    productId: string,
    fromWarehouseId: string,
    toWarehouseId: string,
    quantity: number,
    notes: string
  ) => Promise<void>;
}

export function StockTransferModal({
  isOpen,
  onClose,
  product,
  warehouses,
  onTransfer,
}: StockTransferModalProps) {
  const [fromWarehouse, setFromWarehouse] = useState('');
  const [toWarehouse, setToWarehouse] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Auto-select first warehouse with stock
      const warehouseWithStock = product.warehouses.find((w) => w.quantity > 0);
      if (warehouseWithStock) {
        setFromWarehouse(warehouseWithStock.warehouseId);
      } else {
        setFromWarehouse('');
      }
      setToWarehouse('');
      setQuantity('');
      setNotes('');
      setError('');
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const getAvailableQuantity = () => {
    if (!fromWarehouse) return 0;
    const warehouseStock = product.warehouses.find(
      (w) => w.warehouseId === fromWarehouse
    );
    return warehouseStock?.available || 0;
  };

  const getFromWarehouseName = () => {
    if (!fromWarehouse) return '';
    const warehouse = warehouses.find((w) => w.id === fromWarehouse);
    return warehouse?.name || '';
  };

  const getToWarehouseName = () => {
    if (!toWarehouse) return '';
    const warehouse = warehouses.find((w) => w.id === toWarehouse);
    return warehouse?.name || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!fromWarehouse) {
      setError('يرجى اختيار المستودع المصدر');
      return;
    }

    if (!toWarehouse) {
      setError('يرجى اختيار المستودع الوجهة');
      return;
    }

    if (fromWarehouse === toWarehouse) {
      setError('لا يمكن النقل إلى نفس المستودع');
      return;
    }

    const qty = parseFloat(quantity);
    if (!quantity || isNaN(qty) || qty <= 0) {
      setError('الكمية يجب أن تكون أكبر من صفر');
      return;
    }

    const available = getAvailableQuantity();
    if (qty > available) {
      setError(`الكمية المتاحة فقط ${available} ${product.unit}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onTransfer(product.id, fromWarehouse, toWarehouse, qty, notes);
      onClose();
    } catch (error) {
      setError('فشل نقل المخزون');
    } finally {
      setIsSubmitting(false);
    }
  };

  const swapWarehouses = () => {
    if (fromWarehouse && toWarehouse) {
      const temp = fromWarehouse;
      setFromWarehouse(toWarehouse);
      setToWarehouse(temp);
      setQuantity('');
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8" dir="rtl">
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
        className="relative w-full max-w-3xl max-h-[calc(100vh-128px)] bg-[#2a2d32] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(255,255,255,0.1)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgba(34,211,238,0.2)] to-[rgba(0,99,153,0.1)] border border-cyan-400/30 flex items-center justify-center">
              <ArrowRightLeft className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-['Almarai'] font-bold text-[#e2e2e6]">
                نقل المخزون بين المستودعات
              </h2>
              <p className="text-sm text-[#c2c7ce] font-['Almarai']">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] transition-all"
          >
            <X className="w-5 h-5 text-[#c2c7ce]" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Product Info */}
            <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                  <Package className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-['Almarai'] font-bold text-[#e2e2e6]">
                    {product.name}
                  </h3>
                  <p className="text-sm font-['Almarai'] text-[#c2c7ce]">
                    رمز المنتج: {product.sku}
                  </p>
                </div>
              </div>
            </div>

            {/* Transfer Direction */}
            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
              {/* From Warehouse */}
              <div>
                <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
                  من المستودع <span className="text-red-400">*</span>
                </label>
                <select
                  value={fromWarehouse}
                  onChange={(e) => {
                    setFromWarehouse(e.target.value);
                    setQuantity('');
                    setError('');
                  }}
                  className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Almarai'] focus:outline-none focus:border-cyan-400/50 transition-colors"
                  dir="rtl"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">اختر المستودع</option>
                  {product.warehouses
                    .filter((w) => w.quantity > 0)
                    .map((warehouseStock) => {
                      const warehouse = warehouses.find(
                        (wh) => wh.id === warehouseStock.warehouseId
                      );
                      return (
                        <option
                          key={warehouseStock.warehouseId}
                          value={warehouseStock.warehouseId}
                        >
                          {warehouse?.name || warehouseStock.warehouseName} - متاح:{' '}
                          {warehouseStock.available} {product.unit}
                        </option>
                      );
                    })}
                </select>
                {fromWarehouse && (
                  <p className="text-xs font-['Almarai'] text-cyan-400 mt-2">
                    الكمية المتاحة: {getAvailableQuantity()} {product.unit}
                  </p>
                )}
              </div>

              {/* Swap Button */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={swapWarehouses}
                  disabled={!fromWarehouse || !toWarehouse || isSubmitting}
                  className="p-3 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
                </button>
              </div>

              {/* To Warehouse */}
              <div>
                <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
                  إلى المستودع <span className="text-red-400">*</span>
                </label>
                <select
                  value={toWarehouse}
                  onChange={(e) => {
                    setToWarehouse(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Almarai'] focus:outline-none focus:border-cyan-400/50 transition-colors"
                  dir="rtl"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">اختر المستودع</option>
                  {warehouses
                    .filter((w) => w.id !== fromWarehouse)
                    .map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Transfer Preview */}
            {fromWarehouse && toWarehouse && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(34,211,238,0.1)] to-[rgba(0,99,153,0.05)] border border-cyan-400/20">
                <div className="flex items-center justify-center gap-3">
                  <div className="text-center flex-1">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.1)]">
                      <WarehouseIcon className="w-5 h-5 text-cyan-400" />
                      <span className="font-['Almarai'] font-bold text-[#e2e2e6]">
                        {getFromWarehouseName()}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                  <div className="text-center flex-1">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.1)]">
                      <WarehouseIcon className="w-5 h-5 text-cyan-400" />
                      <span className="font-['Almarai'] font-bold text-[#e2e2e6]">
                        {getToWarehouseName()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
                الكمية المراد نقلها <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={getAvailableQuantity()}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="أدخل الكمية"
                  className="w-full px-4 py-3 pl-16 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Arial'] focus:outline-none focus:border-cyan-400/50 transition-colors"
                  dir="rtl"
                  required
                  disabled={!fromWarehouse || isSubmitting}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-['Almarai'] text-[#c2c7ce]">
                  {product.unit}
                </span>
              </div>
              {fromWarehouse && (
                <div className="flex items-center justify-between mt-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(getAvailableQuantity().toString())}
                    disabled={isSubmitting}
                    className="text-xs font-['Almarai'] text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    نقل الكمية بالكامل
                  </button>
                  <span className="text-xs font-['Almarai'] text-[#6b7280]">
                    الحد الأقصى: {getAvailableQuantity()} {product.unit}
                  </span>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
                ملاحظات النقل
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أدخل سبب أو ملاحظات النقل..."
                rows={3}
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Almarai'] focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
                dir="rtl"
                disabled={isSubmitting}
              />
            </div>

            {/* Warning */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(245,158,11,0.1)] to-[rgba(217,119,6,0.05)] border border-orange-400/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                </div>
                <p className="text-xs font-['Almarai'] text-orange-300 leading-relaxed">
                  سيتم تسجيل عملية النقل في سجل الحركات ولن يمكن التراجع عنها. يرجى
                  التأكد من صحة البيانات قبل التأكيد.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm font-['Almarai'] text-red-400">{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Footer - Fixed */}
        <div className="px-6 py-4 border-t border-[rgba(255,255,255,0.1)] flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] font-['Almarai'] font-bold transition-all disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-b from-[#22d3ee] to-[#006399] text-[#00373a] hover:opacity-90 font-['Almarai'] font-bold transition-all disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>{isSubmitting ? 'جاري النقل...' : 'تأكيد النقل'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
