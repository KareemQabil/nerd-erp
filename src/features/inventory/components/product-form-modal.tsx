/**
 * Product Form Modal
 * Add/Edit product with full details
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  X,
  Package,
  Save,
  AlertCircle,
  Plus,
  Trash2,
  DollarSign,
  Barcode,
  Tag,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type {
  Product,
  Category,
  Warehouse,
  Supplier,
} from "../types/inventory.types";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { StyledNumberInput } from "@/components/ui/styled-number-input";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null; // null for add, object for edit
  categories: Category[];
  warehouses: Warehouse[];
  suppliers: Supplier[];
  onSave: (product: Partial<Product>) => Promise<void>;
}

interface WarehouseStockInput {
  warehouseId: string;
  quantity: number;
  reserved: number;
}

export function ProductFormModal({
  isOpen,
  onClose,
  product,
  categories,
  warehouses,
  suppliers,
  onSave,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    sku: "",
    barcode: "",
    description: "",
    categoryId: "",
    price: "",
    cost: "",
    unit: "قطعة",
    supplierId: "",
    minStock: "",
    maxStock: "",
    reorderPoint: "",
    status: "active" as "active" | "inactive" | "discontinued",
  });

  const [warehouseStocks, setWarehouseStocks] = useState<WarehouseStockInput[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = !!product;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        nameEn: product.nameEn || "",
        sku: product.sku,
        barcode: product.barcode || "",
        description: product.description || "",
        categoryId: product.category.id,
        price: product.price.toString(),
        cost: product.cost.toString(),
        unit: product.unit,
        supplierId: product.supplier?.id || "",
        minStock: product.minStock.toString(),
        maxStock: product.maxStock.toString(),
        reorderPoint: product.reorderPoint.toString(),
        status: product.status,
      });
      setWarehouseStocks(
        product.warehouses.map((w) => ({
          warehouseId: w.warehouseId,
          quantity: w.quantity,
          reserved: w.reserved,
        }))
      );
    } else {
      // Initialize with default warehouse if exists
      const defaultWarehouse = warehouses.find((w) => w.isDefault);
      if (defaultWarehouse && warehouses.length > 0) {
        setWarehouseStocks([
          {
            warehouseId: defaultWarehouse.id,
            quantity: 0,
            reserved: 0,
          },
        ]);
      }
      setFormData({
        name: "",
        nameEn: "",
        sku: `SKU-${Date.now().toString().slice(-6)}`,
        barcode: "",
        description: "",
        categoryId: categories[0]?.id || "",
        price: "",
        cost: "",
        unit: "قطعة",
        supplierId: "",
        minStock: "10",
        maxStock: "1000",
        reorderPoint: "50",
        status: "active",
      });
    }
    setError("");
  }, [product, isOpen, warehouses, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("اسم المنتج بالعربي مطلوب");
      return;
    }

    if (!formData.categoryId) {
      setError("الفئة مطلوبة");
      return;
    }

    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price < 0) {
      setError("السعر يجب أن يكون رقم صحيح");
      return;
    }

    const cost = parseFloat(formData.cost);
    if (!formData.cost || isNaN(cost) || cost < 0) {
      setError("التكلفة يجب أن تكون رقم صحيح");
      return;
    }

    const minStock = parseInt(formData.minStock);
    const maxStock = parseInt(formData.maxStock);
    const reorderPoint = parseInt(formData.reorderPoint);

    if (isNaN(minStock) || isNaN(maxStock) || isNaN(reorderPoint)) {
      setError("قيم المخزون يجب أن تكون أرقام صحيحة");
      return;
    }

    if (minStock > maxStock) {
      setError("الحد الأدنى يجب أن يكون أقل من الحد الأقصى");
      return;
    }

    if (warehouseStocks.length === 0) {
      setError("يجب إضافة مخزون في مستودع واحد على الأقل");
      return;
    }

    setIsSubmitting(true);
    try {
      const category = categories.find((c) => c.id === formData.categoryId);
      const supplier = suppliers.find((s) => s.id === formData.supplierId);

      await onSave({
        ...(product?.id && { id: product.id }),
        name: formData.name.trim(),
        nameEn: formData.nameEn.trim() || undefined,
        sku: formData.sku.trim(),
        barcode: formData.barcode.trim() || undefined,
        description: formData.description.trim() || undefined,
        category: category!,
        price,
        cost,
        unit: formData.unit,
        supplier: supplier || undefined,
        minStock,
        maxStock,
        reorderPoint,
        status: formData.status,
        warehouses: warehouseStocks.map((ws) => ({
          warehouseId: ws.warehouseId,
          warehouseName:
            warehouses.find((w) => w.id === ws.warehouseId)?.name || "",
          quantity: ws.quantity,
          reserved: ws.reserved,
          available: ws.quantity - ws.reserved,
        })),
      });
      onClose();
    } catch (error) {
      setError("فشل حفظ المنتج");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addWarehouseStock = () => {
    const availableWarehouses = warehouses.filter(
      (w) => !warehouseStocks.some((ws) => ws.warehouseId === w.id)
    );
    if (availableWarehouses.length > 0) {
      setWarehouseStocks([
        ...warehouseStocks,
        {
          warehouseId: availableWarehouses[0].id,
          quantity: 0,
          reserved: 0,
        },
      ]);
    }
  };

  const removeWarehouseStock = (index: number) => {
    setWarehouseStocks(warehouseStocks.filter((_, i) => i !== index));
  };

  const updateWarehouseStock = (
    index: number,
    field: "warehouseId" | "quantity" | "reserved",
    value: string | number
  ) => {
    const updated = [...warehouseStocks];
    if (field === "warehouseId") {
      updated[index].warehouseId = value as string;
    } else {
      updated[index][field] =
        typeof value === "string" ? parseInt(value) || 0 : value;
    }
    setWarehouseStocks(updated);
  };

  const getTotalStock = () => {
    return warehouseStocks.reduce((sum, ws) => sum + ws.quantity, 0);
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
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[rgba(34,211,238,0.2)] to-[rgba(0,99,153,0.1)] border border-cyan-400/30 flex items-center justify-center">
              <Package className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-['Almarai'] font-bold text-[#e2e2e6]">
                {isEditMode ? "تعديل المنتج" : "إضافة منتج جديد"}
              </h2>
              {isEditMode && product && (
                <p className="text-sm text-[#c2c7ce] font-['Almarai']">
                  {product.name}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] transition-all"
          >
            <X className="w-5 h-5 text-[#c2c7ce]" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-5">
                <h3 className="text-sm font-['Almarai'] font-bold text-cyan-400 uppercase tracking-wider">
                  معلومات المنتج الأساسية
                </h3>

                {/* Product Name AR */}
                <div>
                  <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
                    اسم المنتج (بالعربي) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="مثال: كابتشينو"
                    className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Almarai'] placeholder:text-[#6b7280] focus:outline-none focus:border-cyan-400/50 transition-colors"
                    dir="rtl"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Product Name EN */}
                <div>
                  <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
                    اسم المنتج (بالإنجليزي)
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) =>
                      setFormData({ ...formData, nameEn: e.target.value })
                    }
                    placeholder="Example: Cappuccino"
                    className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Arial'] placeholder:text-[#6b7280] focus:outline-none focus:border-cyan-400/50 transition-colors"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                </div>

                {/* SKU & Barcode */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
                      رمز المنتج (SKU) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Tag className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c2c7ce] pointer-events-none" />
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) =>
                          setFormData({ ...formData, sku: e.target.value })
                        }
                        placeholder="SKU-001"
                        className="w-full pr-11 pl-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Arial'] placeholder:text-[#6b7280] focus:outline-none focus:border-cyan-400/50 transition-colors"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
                      الباركود
                    </label>
                    <div className="relative">
                      <Barcode className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c2c7ce] pointer-events-none" />
                      <input
                        type="text"
                        value={formData.barcode}
                        onChange={(e) =>
                          setFormData({ ...formData, barcode: e.target.value })
                        }
                        placeholder="628123456789"
                        className="w-full pr-11 pl-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Arial'] placeholder:text-[#6b7280] focus:outline-none focus:border-cyan-400/50 transition-colors"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Category & Unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
                      الفئة <span className="text-red-400">*</span>
                    </label>
                    <CustomDropdown
                      value={formData.categoryId}
                      onChange={(value) =>
                        setFormData({ ...formData, categoryId: value })
                      }
                      options={[
                        { value: "", label: "اختر الفئة" },
                        ...categories.map((cat) => ({
                          value: cat.id,
                          label: cat.name,
                        })),
                      ]}
                      placeholder="اختر الفئة"
                      dir="rtl"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
                      الوحدة <span className="text-red-400">*</span>
                    </label>
                    <CustomDropdown
                      value={formData.unit}
                      onChange={(value) =>
                        setFormData({ ...formData, unit: value })
                      }
                      options={[
                        { value: "قطعة", label: "قطعة" },
                        { value: "كوب", label: "كوب" },
                        { value: "كيلو", label: "كيلو" },
                        { value: "جرام", label: "جرام" },
                        { value: "لتر", label: "لتر" },
                        { value: "علبة", label: "علبة" },
                        { value: "صندوق", label: "صندوق" },
                      ]}
                      placeholder="اختر الوحدة"
                      dir="rtl"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Price & Cost */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
                      السعر (ر.س) <span className="text-red-400">*</span>
                    </label>
                    <StyledNumberInput
                      value={formData.price}
                      onChange={(value) =>
                        setFormData({ ...formData, price: value })
                      }
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      icon={DollarSign}
                      iconColor="text-green-400"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
                      التكلفة (ر.س) <span className="text-red-400">*</span>
                    </label>
                    <StyledNumberInput
                      value={formData.cost}
                      onChange={(value) =>
                        setFormData({ ...formData, cost: value })
                      }
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      icon={DollarSign}
                      iconColor="text-orange-400"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                {/* Supplier & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
                      المورد
                    </label>
                    <CustomDropdown
                      value={formData.supplierId}
                      onChange={(value) =>
                        setFormData({ ...formData, supplierId: value })
                      }
                      options={[
                        { value: "", label: "بدون مورد" },
                        ...suppliers.map((sup) => ({
                          value: sup.id,
                          label: sup.name,
                        })),
                      ]}
                      placeholder="اختر المورد"
                      dir="rtl"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
                      حالة المنتج
                    </label>
                    <CustomDropdown
                      value={formData.status}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          status: value as
                            | "active"
                            | "inactive"
                            | "discontinued",
                        })
                      }
                      options={[
                        { value: "active", label: "نشط" },
                        { value: "inactive", label: "غير نشط" },
                        { value: "discontinued", label: "متوقف" },
                      ]}
                      placeholder="اختر الحالة"
                      dir="rtl"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-2 block">
                    الوصف
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="وصف تفصيلي للمنتج..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] font-['Almarai'] placeholder:text-[#6b7280] focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
                    dir="rtl"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Right Column - Stock & Warehouses */}
              <div className="space-y-5">
                <h3 className="text-sm font-['Almarai'] font-bold text-cyan-400 uppercase tracking-wider">
                  إدارة المخزون
                </h3>

                {/* Stock Limits */}
                <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]">
                  <h4 className="text-sm font-['Almarai'] font-bold text-[#e2e2e6] mb-3">
                    حدود المخزون
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1 block">
                        الحد الأدنى
                      </label>
                      <div className="relative">
                        <StyledNumberInput
                          value={formData.minStock}
                          onChange={(value) =>
                            setFormData({
                              ...formData,
                              minStock: value,
                            })
                          }
                          min="0"
                          icon={TrendingDown}
                          iconColor="text-red-400"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1 block">
                        نقطة الطلب
                      </label>
                      <div className="relative">
                        <StyledNumberInput
                          value={formData.reorderPoint}
                          onChange={(value) =>
                            setFormData({
                              ...formData,
                              reorderPoint: value,
                            })
                          }
                          min="0"
                          icon={AlertCircle}
                          iconColor="text-orange-400"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-['Almarai'] text-[#c2c7ce] mb-1 block">
                        الحد الأقصى
                      </label>
                      <div className="relative">
                        <StyledNumberInput
                          value={formData.maxStock}
                          onChange={(value) =>
                            setFormData({
                              ...formData,
                              maxStock: value,
                            })
                          }
                          min="0"
                          icon={TrendingUp}
                          iconColor="text-green-400"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warehouse Stocks */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-['Almarai'] font-bold text-[#e2e2e6]">
                      المخزون في المستودعات{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={addWarehouseStock}
                      disabled={
                        warehouseStocks.length >= warehouses.length ||
                        isSubmitting
                      }
                      className="px-3 py-1 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] text-xs font-['Almarai'] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>إضافة مستودع</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {warehouseStocks.map((ws, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]"
                      >
                        <div className="grid grid-cols-[1fr,80px,80px,auto] gap-2 items-center">
                          <CustomDropdown
                            value={ws.warehouseId}
                            onChange={(value) =>
                              updateWarehouseStock(index, "warehouseId", value)
                            }
                            options={warehouses
                              .filter(
                                (w) =>
                                  w.id === ws.warehouseId ||
                                  !warehouseStocks.some(
                                    (wsi) => wsi.warehouseId === w.id
                                  )
                              )
                              .map((wh) => ({
                                value: wh.id,
                                label: wh.name,
                              }))}
                            placeholder="اختر المستودع"
                            dir="rtl"
                            className="w-full"
                          />
                          <StyledNumberInput
                            value={ws.quantity}
                            onChange={(value) =>
                              updateWarehouseStock(index, "quantity", value)
                            }
                            placeholder="الكمية"
                            min="0"
                            disabled={isSubmitting}
                          />
                          <StyledNumberInput
                            value={ws.reserved}
                            onChange={(value) =>
                              updateWarehouseStock(index, "reserved", value)
                            }
                            placeholder="محجوز"
                            min="0"
                            max={ws.quantity}
                            disabled={isSubmitting}
                          />
                          <button
                            type="button"
                            onClick={() => removeWarehouseStock(index)}
                            disabled={
                              warehouseStocks.length === 1 || isSubmitting
                            }
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Stock Summary */}
                  {warehouseStocks.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-linear-to-br from-[rgba(34,211,238,0.1)] to-[rgba(0,99,153,0.05)] border border-cyan-400/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-['Almarai'] text-[#c2c7ce]">
                          إجمالي المخزون
                        </span>
                        <span className="text-lg font-['Arial'] font-bold text-cyan-400">
                          {getTotalStock()} {formData.unit}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 rounded-xl bg-linear-to-br from-[rgba(245,158,11,0.1)] to-[rgba(217,119,6,0.05)] border border-orange-400/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-400/20 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="text-xs font-['Almarai'] text-orange-300 leading-relaxed">
                      <p className="mb-2">
                        • الحد الأدنى: عند الوصول له يتم إنشاء تنبيه
                      </p>
                      <p className="mb-2">
                        • نقطة الطلب: الكمية المثالية لطلب مخزون جديد
                      </p>
                      <p>• الحد الأقصى: السعة القصوى للمخزون</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-sm font-['Almarai'] text-red-400">{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Footer - Fixed */}
        <div className="px-6 py-4 border-t border-[rgba(255,255,255,0.1)] flex gap-3 shrink-0">
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
            className="flex-1 px-6 py-3 rounded-xl bg-linear-to-b from-[#22d3ee] to-[#006399] text-[#00373a] hover:opacity-90 font-['Almarai'] font-bold transition-all disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>
              {isSubmitting
                ? "جاري الحفظ..."
                : isEditMode
                ? "حفظ التعديلات"
                : "إضافة المنتج"}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
