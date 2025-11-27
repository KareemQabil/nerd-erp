import React, { useState } from "react";
import type { Product } from "../types/inventory.types";
import {
  X,
  Package,
  TrendingUp,
  TrendingDown,
  BarChart3,
  AlertCircle,
  Edit,
  Trash2,
  Copy,
  History,
  Warehouse,
  Plus,
  Minus,
} from "lucide-react";
import { motion } from "motion/react";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onEdit: () => void;
  onAdjustStock: (
    warehouseId: string,
    quantity: number,
    type: "add" | "remove"
  ) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onEdit,
  onAdjustStock,
}: ProductDetailModalProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "warehouses" | "history"
  >("overview");

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "text-green-400";
      case "low-stock":
        return "text-orange-400";
      case "out-of-stock":
        return "text-red-400";
      default:
        return "text-[#c2c7ce]";
    }
  };

  const getTotalStock = () => {
    return product.warehouses.reduce((sum, wh) => sum + wh.quantity, 0);
  };

  const getTotalValue = () => {
    return getTotalStock() * product.price;
  };

  const getTotalCost = () => {
    return getTotalStock() * product.cost;
  };

  const getProfit = () => {
    return getTotalValue() - getTotalCost();
  };

  const getProfitMargin = () => {
    if (getTotalValue() === 0) return 0;
    return (getProfit() / getTotalValue()) * 100;
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
        className="relative w-full max-w-4xl max-h-[calc(100vh-128px)] bg-[#2a2d32] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.1)] shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[rgba(34,211,238,0.2)] to-[rgba(0,99,153,0.1)] border border-cyan-400/30 flex items-center justify-center">
              <Package className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-['Almarai'] font-bold text-[#e2e2e6]">
                {product.name}
              </h2>
              {product.nameEn && (
                <p className="text-sm text-[#c2c7ce]">{product.nameEn}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] transition-all"
            >
              <Edit className="w-5 h-5 text-[#c2c7ce]" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] transition-all"
            >
              <X className="w-5 h-5 text-[#c2c7ce]" />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-6 py-4 bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.1)] shrink-0">
          <div className="grid grid-cols-5 gap-4">
            <div>
              <p className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1">
                الكمية الإجمالية
              </p>
              <p className="text-2xl font-['Arial'] font-bold text-cyan-400">
                {getTotalStock()}
              </p>
              <p className="text-xs font-['Almarai'] text-[#c2c7ce]">
                {product.unit}
              </p>
            </div>
            <div>
              <p className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1">
                قيمة المخزون
              </p>
              <p className="text-xl font-['Arial'] font-bold text-green-400">
                {getTotalValue().toFixed(2)}
              </p>
              <p className="text-xs font-['Almarai'] text-[#c2c7ce]">ر.س</p>
            </div>
            <div>
              <p className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1">
                إجمالي التكلفة
              </p>
              <p className="text-xl font-['Arial'] font-bold text-orange-400">
                {getTotalCost().toFixed(2)}
              </p>
              <p className="text-xs font-['Almarai'] text-[#c2c7ce]">ر.س</p>
            </div>
            <div>
              <p className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1">
                الربح المتوقع
              </p>
              <p className="text-xl font-['Arial'] font-bold text-cyan-400">
                {getProfit().toFixed(2)}
              </p>
              <p className="text-xs font-['Almarai'] text-[#c2c7ce]">ر.س</p>
            </div>
            <div>
              <p className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1">
                هامش الربح
              </p>
              <p className="text-xl font-['Arial'] font-bold text-purple-400">
                {getProfitMargin().toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-[rgba(255,255,255,0.1)] flex gap-1 shrink-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 font-['Almarai'] font-bold transition-all ${
              activeTab === "overview"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-[#c2c7ce] hover:text-[#e2e2e6]"
            }`}
          >
            نظرة عامة
          </button>
          <button
            onClick={() => setActiveTab("warehouses")}
            className={`px-4 py-3 font-['Almarai'] font-bold transition-all ${
              activeTab === "warehouses"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-[#c2c7ce] hover:text-[#e2e2e6]"
            }`}
          >
            المستودعات ({product.warehouses.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-3 font-['Almarai'] font-bold transition-all ${
              activeTab === "history"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-[#c2c7ce] hover:text-[#e2e2e6]"
            }`}
          >
            السجل
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1 block">
                      رمز المنتج (SKU)
                    </label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-['Arial'] text-[#e2e2e6] bg-[rgba(255,255,255,0.05)] px-3 py-2 rounded-lg flex-1">
                        {product.sku}
                      </p>
                      <button className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                        <Copy className="w-4 h-4 text-[#c2c7ce]" />
                      </button>
                    </div>
                  </div>

                  {product.barcode && (
                    <div>
                      <label className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1 block">
                        الباركود
                      </label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-['Arial'] text-[#e2e2e6] bg-[rgba(255,255,255,0.05)] px-3 py-2 rounded-lg flex-1">
                          {product.barcode}
                        </p>
                        <button className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                          <Copy className="w-4 h-4 text-[#c2c7ce]" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1 block">
                      الفئة
                    </label>
                    <p className="text-sm font-['Almarai'] text-[#e2e2e6] bg-[rgba(255,255,255,0.05)] px-3 py-2 rounded-lg">
                      {product.category.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1 block">
                      وحدة القياس
                    </label>
                    <p className="text-sm font-['Almarai'] text-[#e2e2e6] bg-[rgba(255,255,255,0.05)] px-3 py-2 rounded-lg">
                      {product.unit}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1 block">
                      سعر البيع
                    </label>
                    <p className="text-lg font-['Arial'] font-bold text-cyan-400 bg-[rgba(34,211,238,0.1)] px-3 py-2 rounded-lg">
                      {product.price.toFixed(2)} ر.س
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1 block">
                      التكلفة
                    </label>
                    <p className="text-lg font-['Arial'] font-bold text-orange-400 bg-[rgba(245,158,11,0.1)] px-3 py-2 rounded-lg">
                      {product.cost.toFixed(2)} ر.س
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1 block">
                      الحد الأدنى للمخزون
                    </label>
                    <p className="text-sm font-['Arial'] text-[#e2e2e6] bg-[rgba(255,255,255,0.05)] px-3 py-2 rounded-lg">
                      {product.minStock} {product.unit}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1 block">
                      الحالة
                    </label>
                    <span
                      className={`inline-block text-sm font-['Almarai'] font-bold px-3 py-2 rounded-lg ${getStockStatusColor(
                        product.stockStatus
                      )} bg-[rgba(255,255,255,0.05)]`}
                    >
                      {product.stockStatus === "in-stock"
                        ? "متوفر"
                        : product.stockStatus === "low-stock"
                        ? "منخفض"
                        : "نفذ"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <label className="text-xs font-['Almarai'] text-[#c2c7ce] mb-2 block">
                    الوصف
                  </label>
                  <p className="text-sm font-['Almarai'] text-[#e2e2e6] bg-[rgba(255,255,255,0.05)] px-4 py-3 rounded-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "warehouses" && (
            <div className="space-y-3">
              {product.warehouses.map((warehouse) => (
                <div
                  key={warehouse.warehouseId}
                  className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[rgba(139,92,246,0.2)] to-[rgba(124,58,237,0.1)] border border-purple-400/30 flex items-center justify-center">
                        <Warehouse className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-['Almarai'] font-bold text-[#e2e2e6]">
                          {warehouse.warehouseName}
                        </p>
                        <p className="text-xs text-[#c2c7ce] font-['Almarai']">
                          {warehouse.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-['Arial'] font-bold text-cyan-400">
                        {warehouse.quantity}
                      </p>
                      <p className="text-xs font-['Almarai'] text-[#c2c7ce]">
                        {product.unit}
                      </p>
                    </div>
                  </div>

                  {/* Quick Adjust */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        onAdjustStock(warehouse.warehouseId, 1, "add")
                      }
                      className="flex-1 py-2 rounded-lg bg-green-400/10 border border-green-400/30 text-green-400 hover:bg-green-400/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-['Almarai'] font-bold">
                        إضافة
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        onAdjustStock(warehouse.warehouseId, 1, "remove")
                      }
                      className="flex-1 py-2 rounded-lg bg-red-400/10 border border-red-400/30 text-red-400 hover:bg-red-400/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Minus className="w-4 h-4" />
                      <span className="text-sm font-['Almarai'] font-bold">
                        خصم
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-3">
              {/* Mock history data */}
              {[
                {
                  date: "2024-01-15",
                  time: "14:30",
                  type: "add",
                  quantity: 50,
                  warehouse: "المستودع الرئيسي",
                  user: "أحمد محمد",
                  note: "إضافة مخزون جديد",
                },
                {
                  date: "2024-01-14",
                  time: "10:15",
                  type: "remove",
                  quantity: 15,
                  warehouse: "المستودع الفرعي",
                  user: "خالد ��حمد",
                  note: "بيع POS",
                },
                {
                  date: "2024-01-13",
                  time: "16:45",
                  type: "adjust",
                  quantity: -5,
                  warehouse: "المستودع الرئيسي",
                  user: "أحمد محمد",
                  note: "تسوية جرد",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.type === "add"
                            ? "bg-green-400/10 border border-green-400/30"
                            : item.type === "remove"
                            ? "bg-red-400/10 border border-red-400/30"
                            : "bg-orange-400/10 border border-orange-400/30"
                        }`}
                      >
                        {item.type === "add" ? (
                          <Plus
                            className={`w-5 h-5 ${
                              item.type === "add" ? "text-green-400" : ""
                            }`}
                          />
                        ) : item.type === "remove" ? (
                          <Minus className="w-5 h-5 text-red-400" />
                        ) : (
                          <History className="w-5 h-5 text-orange-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-['Almarai'] font-bold text-[#e2e2e6] mb-1">
                          {item.note}
                        </p>
                        <p className="text-xs text-[#c2c7ce] font-['Almarai'] mb-2">
                          {item.warehouse} • {item.user}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[#c2c7ce]">
                          <span className="font-['Arial']">{item.date}</span>
                          <span>•</span>
                          <span className="font-['Arial']">{item.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <p
                        className={`text-xl font-['Arial'] font-bold ${
                          item.type === "add"
                            ? "text-green-400"
                            : item.type === "remove"
                            ? "text-red-400"
                            : "text-orange-400"
                        }`}
                      >
                        {item.type === "add" ? "+" : ""}
                        {item.quantity}
                      </p>
                      <p className="text-xs font-['Almarai'] text-[#c2c7ce]">
                        {product.unit}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[rgba(255,255,255,0.1)] flex items-center justify-between shrink-0">
          <button className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            <span className="font-['Almarai'] font-bold">حذف المنتج</span>
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] font-['Almarai'] font-bold transition-all"
            >
              إغلاق
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
