import React from "react";
import { useTranslation } from "react-i18next";
import type { CartItem } from "../types/pos.types";
import { X, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onAddNotes: (itemId: string, notes: string) => void;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

export function CartPanel({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  subtotal,
  tax,
  discount,
  total,
}: CartPanelProps) {
  const { t } = useTranslation();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          /* Cart Panel - Slides from LEFT (RTL), z-50 */
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-[380px] bg-[var(--surface)] border-l border-[var(--outline-variant)] shadow-[4px_0_24px_rgba(0,0,0,0.15)] z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--outline-variant)] bg-[var(--surface-variant)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-[var(--on-primary)]" />
                </div>
                <div>
                  <h2
                    className="text-lg font-['Almarai'] font-bold text-[var(--on-surface)]"
                    dir="auto"
                  >
                    السلة
                  </h2>
                  <p className="text-[10px] text-[var(--on-surface-variant)]">
                    {items.length} {items.length === 1 ? "عنصر" : "عناصر"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-[var(--surface)] transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[var(--on-surface-variant)]" />
              </button>
            </div>

            {/* Cart Items List - with bottom padding for taskbar (80px) */}
            <div className="flex-1 overflow-y-auto px-3 py-3 pb-[240px]">
              {items.length === 0 ? (
                // Empty State
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-[var(--surface-variant)] flex items-center justify-center mb-3">
                    <ShoppingCart className="w-10 h-10 text-[var(--on-surface-variant)] opacity-50" />
                  </div>
                  <h3
                    className="text-base font-['Almarai'] font-bold text-[var(--on-surface)] mb-1"
                    dir="auto"
                  >
                    السلة فارغة
                  </h3>
                  <p
                    className="text-xs font-['Almarai'] text-[var(--on-surface-variant)]"
                    dir="auto"
                  >
                    ابدأ بإضافة منتجات
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{
                          opacity: 0,
                          x: -20,
                          height: 0,
                          marginBottom: 0,
                        }}
                        transition={{ delay: index * 0.02 }}
                        className="bg-[var(--surface-variant)] rounded-lg border border-[var(--outline-variant)] p-2.5 hover:border-[var(--primary)] transition-colors"
                      >
                        {/* Compact Horizontal Layout */}
                        <div className="flex items-center gap-2">
                          {/* Product Image - Small */}
                          {item.product.imageUrl && (
                            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-[var(--surface)]">
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Product Info - Compact */}
                          <div className="flex-1 min-w-0">
                            <h3
                              className="text-xs font-['Almarai'] font-bold text-[var(--on-surface)] line-clamp-1 text-right"
                              dir="auto"
                            >
                              {item.product.name}
                            </h3>
                            <div className="flex items-center justify-between mt-0.5">
                              <span className="text-[10px] font-['Arial'] text-[var(--primary)]">
                                {item.price.toFixed(2)} ر.س
                              </span>
                              <span className="text-[10px] text-[var(--on-surface-variant)]">
                                × {item.quantity}
                              </span>
                            </div>
                          </div>

                          {/* Quantity Controls - Compact */}
                          <div className="flex items-center gap-1 bg-[var(--surface)] rounded-md p-0.5">
                            <button
                              onClick={() =>
                                onUpdateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="w-6 h-6 rounded hover:bg-[var(--primary)] hover:text-[var(--on-primary)] text-[var(--on-surface-variant)] transition-colors flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <div className="w-6 text-center">
                              <span className="text-xs font-['Arial'] font-bold text-[var(--on-surface)]">
                                {item.quantity}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-6 h-6 rounded hover:bg-[var(--primary)] hover:text-[var(--on-primary)] text-[var(--on-surface-variant)] transition-colors flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right min-w-[60px]">
                            <p className="text-sm font-['Arial'] font-bold text-[var(--on-surface)]">
                              {item.total.toFixed(2)}
                            </p>
                            <p className="text-[9px] text-[var(--on-surface-variant)]">
                              ر.س
                            </p>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="w-7 h-7 rounded-md hover:bg-[var(--error-container)] hover:text-[var(--error)] text-[var(--on-surface-variant)] transition-colors flex items-center justify-center flex-shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Clear Cart Button */}
                  {items.length > 0 && (
                    <button
                      onClick={onClearCart}
                      className="w-full py-2 px-3 rounded-lg bg-[var(--error-container)] text-[var(--error)] hover:bg-[var(--error)] hover:text-[var(--on-error)] transition-all flex items-center justify-center gap-2 font-['Almarai'] text-xs font-bold mt-3"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span dir="auto">تفريغ السلة</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Summary Footer - Fixed at bottom, BELOW taskbar */}
            {items.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--outline-variant)] bg-[var(--surface)] px-4 py-3">
                {/* Summary Lines */}
                <div className="space-y-1.5">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-['Almarai'] text-[var(--on-surface-variant)]"
                      dir="auto"
                    >
                      المجموع الفرعي
                    </span>
                    <span className="text-xs font-['Arial'] font-bold text-[var(--on-surface)]">
                      {subtotal.toFixed(2)} ر.س
                    </span>
                  </div>

                  {/* Tax */}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-['Almarai'] text-[var(--on-surface-variant)]"
                      dir="auto"
                    >
                      الضريبة ({((tax / subtotal) * 100).toFixed(0)}%)
                    </span>
                    <span className="text-xs font-['Arial'] font-bold text-[var(--on-surface)]">
                      {tax.toFixed(2)} ر.س
                    </span>
                  </div>

                  {/* Discount (if any) */}
                  {discount > 0 && (
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-['Almarai'] text-[var(--on-surface-variant)]"
                        dir="auto"
                      >
                        الخصم
                      </span>
                      <span className="text-xs font-['Arial'] font-bold text-[var(--error)]">
                        -{discount.toFixed(2)} ر.س
                      </span>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="border-t border-[var(--outline-variant)] my-1.5" />

                  {/* Total */}
                  <div className="flex items-center justify-between py-1">
                    <span
                      className="text-base font-['Almarai'] font-bold text-[var(--on-surface)]"
                      dir="auto"
                    >
                      الإجمالي
                    </span>
                    <span className="text-xl font-['Arial'] font-bold text-[var(--primary)]">
                      {total.toFixed(2)} ر.س
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
