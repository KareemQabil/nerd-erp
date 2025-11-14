import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ModifierGroup, ProductModifier } from '../types/pos.types';
import { ModifierService } from '../services/pos.service';

interface ProductModifiersModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  quantity: number;
  onConfirm: (modifiers: ProductModifier[], specialInstructions: string, quantity: number) => void;
}

export function ProductModifiersModal({
  isOpen,
  onClose,
  product,
  quantity: initialQuantity,
  onConfirm,
}: ProductModifiersModalProps) {
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>([]);
  const [selectedModifiers, setSelectedModifiers] = useState<ProductModifier[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(initialQuantity);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadModifiers();
      setQuantity(initialQuantity);
      setSelectedModifiers([]);
      setSpecialInstructions('');
    }
  }, [isOpen, product.id]);

  const loadModifiers = async () => {
    setLoading(true);
    try {
      const groups = await ModifierService.getModifierGroups(product.id);
      setModifierGroups(groups);
      
      // Auto-select required defaults
      const defaults: ProductModifier[] = [];
      groups.forEach(group => {
        if (group.isRequired && group.minSelection === 1 && group.options.length > 0) {
          defaults.push(group.options[0]);
        }
      });
      setSelectedModifiers(defaults);
    } catch (error) {
      console.error('Failed to load modifiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModifierToggle = (modifier: ProductModifier, group: ModifierGroup) => {
    const isSelected = selectedModifiers.some(m => m.id === modifier.id);
    const groupModifiers = selectedModifiers.filter(m => 
      group.options.some(opt => opt.id === m.id)
    );

    if (isSelected) {
      // Deselect
      if (group.isRequired && group.minSelection === 1 && groupModifiers.length === 1) {
        // Can't deselect if it's the only one in a required group
        return;
      }
      setSelectedModifiers(prev => prev.filter(m => m.id !== modifier.id));
    } else {
      // Select
      if (groupModifiers.length >= group.maxSelection) {
        // Replace first if single selection, otherwise block
        if (group.maxSelection === 1) {
          setSelectedModifiers(prev => [
            ...prev.filter(m => !group.options.some(opt => opt.id === m.id)),
            modifier
          ]);
        }
        return;
      }
      setSelectedModifiers(prev => [...prev, modifier]);
    }
  };

  const isModifierSelected = (modifierId: string) => {
    return selectedModifiers.some(m => m.id === modifierId);
  };

  const canConfirm = () => {
    return modifierGroups.every(group => {
      if (!group.isRequired) return true;
      const groupSelections = selectedModifiers.filter(m =>
        group.options.some(opt => opt.id === m.id)
      );
      return groupSelections.length >= group.minSelection;
    });
  };

  const calculateTotal = () => {
    const modifiersTotal = selectedModifiers.reduce((sum, mod) => sum + mod.price, 0);
    return (product.price + modifiersTotal) * quantity;
  };

  const handleConfirm = () => {
    if (!canConfirm()) return;
    onConfirm(selectedModifiers, specialInstructions, quantity);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[var(--surface)] rounded-2xl shadow-[0px_10px_38px_-10px_rgba(0,0,0,0.3),0px_10px_20px_-15px_rgba(0,0,0,0.2)] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--outline-variant)]">
            <div className="flex-1">
              <h2 className="font-['Almarai'] text-[var(--on-surface)]" dir="rtl">
                {product.name}
              </h2>
              <p className="text-sm text-[var(--on-surface-variant)] mt-1" dir="ltr">
                {product.nameEn}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--surface-variant)] text-[var(--on-surface)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {loading ? (
              <div className="text-center py-12 text-[var(--on-surface-variant)]">
                <p className="font-['Almarai']" dir="rtl">جاري التحميل...</p>
              </div>
            ) : modifierGroups.length === 0 ? (
              <div className="text-center py-12 text-[var(--on-surface-variant)]">
                <p className="font-['Almarai']" dir="rtl">لا توجد خيارات تخصيص لهذا المنتج</p>
              </div>
            ) : (
              <>
                {/* Modifier Groups */}
                {modifierGroups.map(group => (
                  <div key={group.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-['Almarai'] text-[var(--on-surface)]" dir="rtl">
                        {group.name}
                        {group.isRequired && <span className="text-red-500 mr-1">*</span>}
                      </h3>
                      <p className="text-sm text-[var(--on-surface-variant)] text-right" dir="ltr">
                        {group.maxSelection === 1 ? 'اختر واحد' : `اختر حتى ${group.maxSelection}`}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {group.options.map(option => {
                        const selected = isModifierSelected(option.id);
                        return (
                          <button
                            key={option.id}
                            onClick={() => handleModifierToggle(option, group)}
                            className={`p-3 rounded-xl border-2 transition-all text-right ${
                              selected
                                ? 'border-cyan-400 bg-cyan-400/10'
                                : 'border-[var(--outline-variant)] hover:border-cyan-400/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-['Almarai'] text-[var(--on-surface)]" dir="rtl">
                                  {option.name}
                                </p>
                                {option.price > 0 && (
                                  <p className="text-sm text-[var(--on-surface-variant)]" dir="ltr">
                                    +{option.price.toFixed(2)} ر.س
                                  </p>
                                )}
                              </div>
                              {selected && (
                                <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center">
                                  <Check className="w-3 h-3 text-[#00373a]" />
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Quantity Control */}
                <div className="space-y-3">
                  <h3 className="font-['Almarai'] text-[var(--on-surface)]" dir="rtl">
                    الكمية
                  </h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg bg-[var(--surface-variant)] hover:bg-red-500/20 text-[var(--on-surface)] flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <div className="flex-1 text-center">
                      <span className="font-['Inter'] text-2xl text-[var(--on-surface)]">{quantity}</span>
                    </div>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg bg-cyan-400 hover:bg-cyan-500 text-[#00373a] flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="space-y-3">
                  <h3 className="font-['Almarai'] text-[var(--on-surface)]" dir="rtl">
                    ملاحظات خاصة
                  </h3>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="أي طلبات خاصة..."
                    className="w-full p-3 rounded-xl bg-[var(--surface-variant)] text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)] border border-[var(--outline-variant)] focus:border-cyan-400 outline-none resize-none font-['Almarai']"
                    rows={3}
                    dir="rtl"
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[var(--outline-variant)] space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="font-['Almarai'] text-[var(--on-surface)]" dir="rtl">
                الإجمالي
              </span>
              <span className="font-['Inter'] text-2xl text-cyan-400">
                {calculateTotal().toFixed(2)} ر.س
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-[var(--surface-variant)] text-[var(--on-surface)] font-['Almarai'] hover:bg-[var(--outline-variant)] transition-colors text-center"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirm}
                disabled={!canConfirm()}
                className="flex-1 py-3 rounded-xl bg-cyan-400 text-[#00373a] font-['Almarai'] hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-center"
              >
                إضافة للسلة
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
