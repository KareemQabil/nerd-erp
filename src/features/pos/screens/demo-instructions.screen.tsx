import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Keyboard,
  Mouse,
  Smartphone,
  ShoppingCart,
  Search,
  Grid,
  DollarSign,
  Printer,
  User,
  Clock,
  ArrowRight,
  X,
  CheckCircle,
  Info,
} from "lucide-react";
import { motion } from "motion/react";

export function DemoInstructionsScreen() {
  const navigate = useNavigate();

  const Section = ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div className="bg-[var(--surface)] border border-[var(--outline-variant)] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-[var(--primary)] flex items-center justify-center">
          {icon}
        </div>
        <h2
          className="text-xl font-['Almarai'] font-bold text-[var(--on-surface)]"
          dir="auto"
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );

  const ShortcutItem = ({
    keys,
    description,
  }: {
    keys: string;
    description: string;
  }) => (
    <div className="flex items-center justify-between py-2 border-b border-[var(--outline-variant)] last:border-0">
      <span
        className="text-sm font-['Almarai'] text-[var(--on-surface)]"
        dir="auto"
      >
        {description}
      </span>
      <div className="bg-[var(--primary-container)] border border-[var(--primary)]/30 rounded px-3 py-1">
        <span className="text-sm font-['Arial'] font-bold text-[var(--primary)]">
          {keys}
        </span>
      </div>
    </div>
  );

  const StepItem = ({
    number,
    title,
    description,
  }: {
    number: number;
    title: string;
    description: string;
  }) => (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center shrink-0">
        <span className="text-sm font-['Arial'] font-bold text-[var(--on-primary)]">
          {number}
        </span>
      </div>
      <div className="flex-1">
        <h4
          className="text-sm font-['Almarai'] font-bold text-[var(--on-surface)] mb-1"
          dir="auto"
        >
          {title}
        </h4>
        <p
          className="text-xs font-['Almarai'] text-[var(--on-surface-variant)]"
          dir="auto"
        >
          {description}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      {/* Header */}
      <div className="bg-linear-to-b from-[var(--surface)] to-[var(--surface-variant)] border-b border-[var(--outline-variant)] sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary)] flex items-center justify-center">
                <Info className="w-6 h-6 text-[var(--on-primary)]" />
              </div>
              <div>
                <h1
                  className="text-2xl font-['Almarai'] font-bold text-[var(--on-surface)]"
                  dir="auto"
                >
                  دليل الاستخدام التجريبي
                </h1>
                <p
                  className="text-sm text-[var(--on-surface-variant)]"
                  dir="auto"
                >
                  تعرف على كيفية استخدام نظام نقاط البيع
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/pos")}
              className="px-6 py-3 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] font-['Almarai'] font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <span dir="auto">العودة إلى نقاط البيع</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Keyboard Shortcuts */}
          <Section
            title="اختصارات لوحة المفاتيح"
            icon={<Keyboard className="w-5 h-5 text-[var(--on-primary)]" />}
          >
            <div className="space-y-1">
              <ShortcutItem keys="1-9" description="اختيار الفئة السريع" />
              <ShortcutItem keys="Ctrl+F" description="التركيز على البحث" />
              <ShortcutItem keys="ESC" description="إغلاق النوافذ المنبثقة" />
              <ShortcutItem keys="Enter" description="إضافة المنتج للسلة" />
              <ShortcutItem keys="← →" description="التنقل بين المنتجات" />
              <ShortcutItem keys="↑ ↓" description="التنقل في القوائم" />
            </div>
          </Section>

          {/* Mouse Actions */}
          <Section
            title="إجراءات الماوس"
            icon={<Mouse className="w-5 h-5 text-[var(--on-primary)]" />}
          >
            <div className="space-y-3">
              <StepItem
                number={1}
                title="النقر على المنتج"
                description="اضغط على أي منتج لإضافته مباشرة إلى السلة"
              />
              <StepItem
                number={2}
                title="فتح السلة"
                description="اضغط على زر السلة في شريط الإجراءات السفلي"
              />
              <StepItem
                number={3}
                title="تعديل الكمية"
                description="استخدم أزرار + و - لتعديل الكميات"
              />
              <StepItem
                number={4}
                title="إتمام الدفع"
                description="اضغط على زر 'الدفع' عند الانتهاء"
              />
            </div>
          </Section>

          {/* Touch Gestures (Tablet) */}
          <Section
            title="الإيماءات اللمسية (الأجهزة اللوحية)"
            icon={<Smartphone className="w-5 h-5 text-[var(--on-primary)]" />}
          >
            <div className="space-y-3">
              <StepItem
                number={1}
                title="النقر المفرد"
                description="إضافة المنتج إلى السلة"
              />
              <StepItem
                number={2}
                title="السحب لليسار"
                description="في السلة، اسحب المنتج لليسار لإظهار خيار الحذف"
              />
              <StepItem
                number={3}
                title="التمرير"
                description="مرر لأعلى وأسفل للتنقل في المنتجات"
              />
              <StepItem
                number={4}
                title="النقر المزدوج"
                description="فتح تفاصيل المنتج (قريباً)"
              />
            </div>
          </Section>

          {/* Quick Start Guide */}
          <Section
            title="دليل البدء السريع"
            icon={<CheckCircle className="w-5 h-5 text-[var(--on-primary)]" />}
          >
            <div className="space-y-3">
              <StepItem
                number={1}
                title="اختر الفئة"
                description="انقر على فئة أو اضغط رقم (1-9) للوصول السريع"
              />
              <StepItem
                number={2}
                title="أضف المنتجات"
                description="انقر على المنتجات لإضافتها للسلة"
              />
              <StepItem
                number={3}
                title="راجع السلة"
                description="افتح السلة من شريط الإجراءات وتحقق من الطلب"
              />
              <StepItem
                number={4}
                title="اختر العميل (اختياري)"
                description="أضف معلومات العميل إذا لزم الأمر"
              />
              <StepItem
                number={5}
                title="أضف خصم (اختياري)"
                description="طبق خصومات على الطلب"
              />
              <StepItem
                number={6}
                title="إتمام الدفع"
                description="اضغط على زر الدفع واختر طريقة الدفع"
              />
            </div>
          </Section>

          {/* Action Bar Guide */}
          <Section
            title="شريط الإجراءات"
            icon={<Grid className="w-5 h-5 text-[var(--on-primary)]" />}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-3 py-2 border-b border-[var(--outline-variant)]">
                <ShoppingCart className="w-5 h-5 text-[var(--primary)]" />
                <div className="flex-1">
                  <h4
                    className="text-sm font-['Almarai'] font-bold text-[var(--on-surface)]"
                    dir="auto"
                  >
                    السلة
                  </h4>
                  <p
                    className="text-xs text-[var(--on-surface-variant)]"
                    dir="auto"
                  >
                    عرض وإدارة عناصر الطلب الحالي
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2 border-b border-[var(--outline-variant)]">
                <User className="w-5 h-5 text-[var(--primary)]" />
                <div className="flex-1">
                  <h4
                    className="text-sm font-['Almarai'] font-bold text-[var(--on-surface)]"
                    dir="auto"
                  >
                    العميل
                  </h4>
                  <p
                    className="text-xs text-[var(--on-surface-variant)]"
                    dir="auto"
                  >
                    اختيار أو إضافة معلومات العميل
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2 border-b border-[var(--outline-variant)]">
                <DollarSign className="w-5 h-5 text-[var(--primary)]" />
                <div className="flex-1">
                  <h4
                    className="text-sm font-['Almarai'] font-bold text-[var(--on-surface)]"
                    dir="auto"
                  >
                    الخصم
                  </h4>
                  <p
                    className="text-xs text-[var(--on-surface-variant)]"
                    dir="auto"
                  >
                    تطبيق خصومات على الطلب
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2 border-b border-[var(--outline-variant)]">
                <Clock className="w-5 h-5 text-[var(--primary)]" />
                <div className="flex-1">
                  <h4
                    className="text-sm font-['Almarai'] font-bold text-[var(--on-surface)]"
                    dir="auto"
                  >
                    تعليق الطلب
                  </h4>
                  <p
                    className="text-xs text-[var(--on-surface-variant)]"
                    dir="auto"
                  >
                    حفظ الطلب للعودة إليه لاحقاً
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <Printer className="w-5 h-5 text-[var(--primary)]" />
                <div className="flex-1">
                  <h4
                    className="text-sm font-['Almarai'] font-bold text-[var(--on-surface)]"
                    dir="auto"
                  >
                    الطباعة
                  </h4>
                  <p
                    className="text-xs text-[var(--on-surface-variant)]"
                    dir="auto"
                  >
                    طباعة الفاتورة
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Tips & Tricks */}
          <Section
            title="نصائح وحيل"
            icon={<Info className="w-5 h-5 text-[var(--on-primary)]" />}
          >
            <div className="space-y-3 bg-[var(--primary-container)] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
                <p
                  className="text-sm font-['Almarai'] text-[var(--on-primary-container)]"
                  dir="auto"
                >
                  استخدم اختصارات لوحة المفاتيح لسرعة أكبر في العمل
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
                <p
                  className="text-sm font-['Almarai'] text-[var(--on-primary-container)]"
                  dir="auto"
                >
                  شريط الإجراءات دائماً مرئي في الأسفل حتى مع فتح السلة
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
                <p
                  className="text-sm font-['Almarai'] text-[var(--on-primary-container)]"
                  dir="auto"
                >
                  يمكنك البحث عن المنتجات باستخدام الاسم أو الباركود
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
                <p
                  className="text-sm font-['Almarai'] text-[var(--on-primary-container)]"
                  dir="auto"
                >
                  السلة تحفظ العناصر حتى لو أغلقتها
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
                <p
                  className="text-sm font-['Almarai'] text-[var(--on-primary-container)]"
                  dir="auto"
                >
                  استخدم ميزة "تعليق الطلب" للطلبات التي تحتاج وقت
                </p>
              </div>
            </div>
          </Section>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-6 bg-[var(--surface)] border border-[var(--outline-variant)] rounded-xl">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-[var(--primary)] shrink-0" />
            <div>
              <h3
                className="text-lg font-['Almarai'] font-bold text-[var(--on-surface)] mb-2"
                dir="auto"
              >
                ملاحظة: هذا عرض تجريبي
              </h3>
              <p
                className="text-sm font-['Almarai'] text-[var(--on-surface-variant)] leading-relaxed"
                dir="auto"
              >
                هذا النظام هو نسخة تجريبية لتوضيح الميزات والوظائف. جميع
                البيانات والمنتجات المعروضة هي بيانات وهمية للتوضيح فقط. في
                النسخة الكاملة، سيتم ربط النظام بقاعدة بيانات حقيقية وطابعات
                الإيصالات ونظام الدفع الإلكتروني.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
