import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { Product, Warehouse } from "../types/pos.types";
import { POSService, WarehouseService } from "../services/pos.service";
import {
  ArrowRight,
  Package,
  AlertTriangle,
  Search,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import { motion } from "motion/react";

export default function StockScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, whs] = await Promise.all([
        POSService.getProducts(),
        WarehouseService.getWarehouses(),
      ]);
      setProducts(prods);
      setWarehouses(whs);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return "out";
    if (stock < 10) return "low";
    if (stock < 30) return "medium";
    return "high";
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case "out":
        return "text-[#ef4444] bg-[rgba(239,68,68,0.2)] border-[#ef4444]";
      case "low":
        return "text-[#f59e0b] bg-[rgba(245,158,11,0.2)] border-[#f59e0b]";
      case "medium":
        return "text-[#22d3ee] bg-[rgba(34,211,238,0.2)] border-[#22d3ee]";
      case "high":
        return "text-[#10b981] bg-[rgba(16,185,129,0.2)] border-[#10b981]";
      default:
        return "text-[#c2c7ce] bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]";
    }
  };

  const filteredProducts = products
    .filter((p) => {
      if (filter === "low") return p.stock > 0 && p.stock < 10;
      if (filter === "out") return p.stock === 0;
      return true;
    })
    .filter((p) => {
      if (!searchQuery) return true;
      return (
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const stats = {
    total: products.length,
    low: products.filter((p) => p.stock > 0 && p.stock < 10).length,
    out: products.filter((p) => p.stock === 0).length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#023047] to-[#001219]">
      {/* Header */}
      <div className="bg-[rgba(255,255,255,0.05)] border-b border-[rgba(255,255,255,0.1)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.3)]">
        <div className="container mx-auto px-4">
          <div className="h-18 flex items-center justify-between">
            <button
              onClick={() => navigate("/pos")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-[#c2c7ce]" />
              <span className="font-['Almarai'] text-[#c2c7ce]" dir="auto">
                رجوع
              </span>
            </button>

            <h1
              className="text-2xl font-['Almarai'] font-bold text-[#e2e2e6]"
              dir="auto"
            >
              {t("pos.stockStatus")}
            </h1>

            <div className="w-[120px]" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-linear-to-b from-[#1a1c1e] via-[#1d2222] to-[#42474e] rounded-2xl p-4 border border-[#42474e]">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-cyan-400" />
            </div>
            <p
              className="text-sm font-['Almarai'] text-[#c2c7ce] mb-1"
              dir="auto"
            >
              إجمالي المنتجات
            </p>
            <p className="text-2xl font-['Arial'] font-bold text-[#e2e2e6]">
              {stats.total}
            </p>
          </div>

          <div className="bg-linear-to-b from-[rgba(245,158,11,0.2)] to-[rgba(217,119,6,0.2)] rounded-2xl p-4 border border-[#f59e0b]">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-[#f59e0b]" />
            </div>
            <p
              className="text-sm font-['Almarai'] text-[#c2c7ce] mb-1"
              dir="auto"
            >
              مخزون منخفض
            </p>
            <p className="text-2xl font-['Arial'] font-bold text-[#f59e0b]">
              {stats.low}
            </p>
          </div>

          <div className="bg-linear-to-b from-[rgba(239,68,68,0.2)] to-[rgba(220,38,38,0.2)] rounded-2xl p-4 border border-[#ef4444]">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-[#ef4444]" />
            </div>
            <p
              className="text-sm font-['Almarai'] text-[#c2c7ce] mb-1"
              dir="auto"
            >
              نفد المخزون
            </p>
            <p className="text-2xl font-['Arial'] font-bold text-[#ef4444]">
              {stats.out}
            </p>
          </div>

          <div className="bg-linear-to-b from-[rgba(34,211,238,0.2)] to-[rgba(0,99,153,0.2)] rounded-2xl p-4 border border-cyan-400">
            <div className="flex items-center justify-between mb-2">
              <WarehouseIcon className="w-8 h-8 text-cyan-400" />
            </div>
            <p
              className="text-sm font-['Almarai'] text-[#c2c7ce] mb-1"
              dir="auto"
            >
              قيمة المخزون
            </p>
            <p className="text-2xl font-['Arial'] font-bold text-cyan-400">
              {stats.totalValue.toFixed(0)}
            </p>
          </div>
        </div>

        {/* Warehouses */}
        <div className="mb-6">
          <h2
            className="text-lg font-['Almarai'] font-bold text-[#e2e2e6] mb-3"
            dir="auto"
          >
            المستودعات
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {warehouses.map((wh) => (
              <div
                key={wh.id}
                className="bg-linear-to-b from-[#1a1c1e] via-[#1d2222] to-[#42474e] rounded-2xl p-4 border border-[#42474e]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3
                      className="text-base font-['Almarai'] font-bold text-[#e2e2e6]"
                      dir="auto"
                    >
                      {wh.name}
                    </h3>
                    <p className="text-xs text-[#c2c7ce] font-['Inter']">
                      {wh.nameEn}
                    </p>
                  </div>
                  <span className="text-xs font-['Arial'] font-bold text-cyan-400 bg-[rgba(34,211,238,0.1)] px-2 py-1 rounded">
                    {wh.code}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {wh.zones.map((zone) => {
                    const utilization = (
                      (zone.currentStock / zone.capacity) *
                      100
                    ).toFixed(0);
                    return (
                      <div
                        key={zone.id}
                        className="bg-[rgba(255,255,255,0.05)] rounded-lg p-2 text-center"
                      >
                        <p
                          className="text-xs text-[#c2c7ce] font-['Almarai'] mb-1"
                          dir="auto"
                        >
                          {zone.name}
                        </p>
                        <p className="text-sm font-['Arial'] font-bold text-[#e2e2e6]">
                          {utilization}%
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`${t("common.search")}...`}
              className="w-full h-12 px-4 pr-12 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-sm text-[#e2e2e6] placeholder:text-[#c2c7ce] font-['Almarai'] focus:outline-none focus:border-cyan-400/50"
              dir="rtl"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#c2c7ce]" />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-3 rounded-xl font-['Almarai'] transition-all whitespace-nowrap ${
                filter === "all"
                  ? "bg-cyan-400 text-[#00373a]"
                  : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/50"
              }`}
            >
              <span dir="auto">الكل</span>
            </button>
            <button
              onClick={() => setFilter("low")}
              className={`px-6 py-3 rounded-xl font-['Almarai'] transition-all whitespace-nowrap ${
                filter === "low"
                  ? "bg-cyan-400 text-[#00373a]"
                  : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/50"
              }`}
            >
              <span dir="auto">مخزون منخفض</span>
            </button>
            <button
              onClick={() => setFilter("out")}
              className={`px-6 py-3 rounded-xl font-['Almarai'] transition-all whitespace-nowrap ${
                filter === "out"
                  ? "bg-cyan-400 text-[#00373a]"
                  : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#c2c7ce] hover:border-cyan-400/50"
              }`}
            >
              <span dir="auto">نفد المخزون</span>
            </button>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-[#c2c7ce] font-['Almarai']" dir="auto">
              {t("common.loading")}
            </p>
          </div>
        ) : (
          <div className="bg-linear-to-b from-[#1a1c1e] via-[#1d2222] to-[#42474e] rounded-2xl border border-[#42474e] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[rgba(255,255,255,0.05)] border-b border-[rgba(255,255,255,0.1)]">
                  <tr>
                    <th
                      className="px-6 py-4 text-right text-sm font-['Almarai'] text-[#c2c7ce]"
                      dir="auto"
                    >
                      المنتج
                    </th>
                    <th
                      className="px-6 py-4 text-center text-sm font-['Almarai'] text-[#c2c7ce]"
                      dir="auto"
                    >
                      SKU
                    </th>
                    <th
                      className="px-6 py-4 text-center text-sm font-['Almarai'] text-[#c2c7ce]"
                      dir="auto"
                    >
                      الفئة
                    </th>
                    <th
                      className="px-6 py-4 text-center text-sm font-['Almarai'] text-[#c2c7ce]"
                      dir="auto"
                    >
                      الكمية
                    </th>
                    <th
                      className="px-6 py-4 text-center text-sm font-['Almarai'] text-[#c2c7ce]"
                      dir="auto"
                    >
                      السعر
                    </th>
                    <th
                      className="px-6 py-4 text-center text-sm font-['Almarai'] text-[#c2c7ce]"
                      dir="auto"
                    >
                      القيمة
                    </th>
                    <th
                      className="px-6 py-4 text-center text-sm font-['Almarai'] text-[#c2c7ce]"
                      dir="auto"
                    >
                      الحالة
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => {
                    const status = getStockStatus(product.stock);
                    const stockValue = product.price * product.stock;

                    return (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.03)] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p
                                className="text-sm font-['Almarai'] font-bold text-[#e2e2e6]"
                                dir="auto"
                              >
                                {product.name}
                              </p>
                              <p className="text-xs text-[#c2c7ce] font-['Inter']">
                                {product.nameEn}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-xs font-['Arial'] text-[#c2c7ce]">
                            {product.sku || product.id}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className="text-sm font-['Almarai'] text-[#e2e2e6]"
                            dir="auto"
                          >
                            {product.categoryId}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`text-lg font-['Arial'] font-bold ${
                              status === "out"
                                ? "text-[#ef4444]"
                                : status === "low"
                                ? "text-[#f59e0b]"
                                : "text-[#e2e2e6]"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-['Arial'] font-bold text-cyan-400">
                            {product.price.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-['Arial'] font-bold text-[#99f0ff]">
                            {stockValue.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-['Almarai'] ${getStockColor(
                              status
                            )}`}
                          >
                            <span className="w-2 h-2 rounded-full bg-current" />
                            <span dir="auto">
                              {status === "out"
                                ? "نفد"
                                : status === "low"
                                ? "منخفض"
                                : status === "medium"
                                ? "متوسط"
                                : "جيد"}
                            </span>
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
