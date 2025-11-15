import { useAuth } from "@/core/auth/auth.context";
import { ComingSoonScreen } from "@/components/coming-soon-screen";
import LoginScreen from "@/features/auth/screens/login.screen";
import POSRefinedScreen from "@/features/pos/screens/pos-refined.screen";
import { DemoInstructionsScreen } from "@/features/pos/screens/demo-instructions.screen";
import TablesScreen from "@/features/pos/screens/tables.screen";
import StockScreen from "@/features/pos/screens/stock.screen";
import KitchenDisplayScreen from "@/features/pos/screens/kitchen-display.screen";
import DashboardScreen from "@/features/dashboard/screens/dashboard.screen";
import InventoryScreen from "@/features/inventory/screens/inventory.screen";
import OrdersScreen from "@/features/orders/screens/orders.screen";
import CustomersScreen from "@/features/customers/screens/customers.screen";
import SeatingManagementScreen from "@/features/tables/screens/tables.screen";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  Building2,
  TrendingUp,
  UserCog,
  DollarSign,
  Truck,
  ChefHat,
  BarChart3,
  Settings,
} from "lucide-react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#023047] to-[#001219] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#023047] to-[#001219] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginScreen />}
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardScreen />
          </ProtectedRoute>
        }
      />

      {/* POS */}
      <Route
        path="/pos"
        element={
          <ProtectedRoute>
            <POSRefinedScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pos/demo-instructions"
        element={
          <ProtectedRoute>
            <DemoInstructionsScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pos/kitchen-display"
        element={
          <ProtectedRoute>
            <KitchenDisplayScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tables"
        element={
          <ProtectedRoute>
            <TablesScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stock"
        element={
          <ProtectedRoute>
            <StockScreen />
          </ProtectedRoute>
        }
      />

      {/* Orders */}
      <Route
        path="/orders/*"
        element={
          <ProtectedRoute>
            <OrdersScreen />
          </ProtectedRoute>
        }
      />

      {/* Customers */}
      <Route
        path="/customers/*"
        element={
          <ProtectedRoute>
            <CustomersScreen />
          </ProtectedRoute>
        }
      />

      {/* Inventory */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <InventoryScreen />
          </ProtectedRoute>
        }
      />

      {/* Seating / Tables Management */}
      <Route
        path="/seating"
        element={
          <ProtectedRoute>
            <SeatingManagementScreen />
          </ProtectedRoute>
        }
      />

      {/* B2B */}
      <Route
        path="/b2b/*"
        element={
          <ProtectedRoute>
            <ComingSoonScreen
              title="مبيعات B2B"
              titleEn="B2B Sales"
              description="نظام مبيعات الجملة للعملاء التجاريين"
              icon={Building2}
              features={[
                "لوحة معلومات B2B",
                "العملاء التجاريين",
                "عروض الأسعار",
                "طلبات B2B",
                "الفواتير والمدفوعات",
              ]}
            />
          </ProtectedRoute>
        }
      />

      {/* Reports */}
      <Route
        path="/reports/*"
        element={
          <ProtectedRoute>
            <ComingSoonScreen
              title="التقارير والتحليلات"
              titleEn="Reports & Analytics"
              description="تقارير شاملة وتحليلات متقدمة"
              icon={TrendingUp}
              features={[
                "لوحة التقارير",
                "تقارير المبيعات",
                "تقارير المخزون",
                "تقارير العملاء",
                "تقارير الموظفين",
                "التقارير المالية",
                "منشئ تقارير مخصص",
              ]}
            />
          </ProtectedRoute>
        }
      />

      {/* HR */}
      <Route
        path="/hr/*"
        element={
          <ProtectedRoute>
            <ComingSoonScreen
              title="إدارة الموظفين"
              titleEn="Human Resources"
              description="نظام شامل لإدارة الموارد البشرية"
              icon={UserCog}
              features={[
                "إدارة الموظفين",
                "الحضور والمناوبات",
                "الرواتب",
                "تقييم الأداء",
                "التدريب والتطوير",
                "إدارة الإجازات",
              ]}
            />
          </ProtectedRoute>
        }
      />

      {/* Cash Management */}
      <Route
        path="/cash/*"
        element={
          <ProtectedRoute>
            <ComingSoonScreen
              title="إدارة النقدية"
              titleEn="Cash Management"
              description="نظام إدارة الصندوق والتقفيلة اليومية"
              icon={DollarSign}
              features={[
                "الصندوق النقدي",
                "التقفيلة اليومية",
                "معاملات النقدية",
                "التسويات البنكية",
              ]}
            />
          </ProtectedRoute>
        }
      />

      {/* Delivery */}
      <Route
        path="/delivery/*"
        element={
          <ProtectedRoute>
            <ComingSoonScreen
              title="إدارة التوصيل"
              titleEn="Delivery Management"
              description="نظام متكامل لإدارة التوصيل والسائقين"
              icon={Truck}
              features={[
                "لوحة التوصيل",
                "طلبات التوصيل",
                "إدارة السائقين",
                "التتبع المباشر",
                "مناطق التوصيل",
                "تقارير التوصيل",
              ]}
            />
          </ProtectedRoute>
        }
      />

      {/* Kitchen */}
      <Route
        path="/kitchen/*"
        element={
          <ProtectedRoute>
            <ComingSoonScreen
              title="إدارة المطبخ"
              titleEn="Kitchen Management"
              description="نظام عرض المطبخ وإدارة الوصفات"
              icon={ChefHat}
              features={[
                "شاشة عرض المطبخ",
                "إدارة المحطات",
                "إدارة الوصفات",
                "إدارة الهدر",
              ]}
            />
          </ProtectedRoute>
        }
      />

      {/* Analytics */}
      <Route
        path="/analytics/*"
        element={
          <ProtectedRoute>
            <ComingSoonScreen
              title="التحليلات المتقدمة"
              titleEn="Advanced Analytics"
              description="ذكاء الأعمال والتحليلات التنبؤية"
              icon={BarChart3}
              features={[
                "لوحة ذكاء الأعمال",
                "تحليلات المبيعات",
                "تحليلات المخزون",
                "تحليلات العملاء",
                "تحليل الربحية",
              ]}
            />
          </ProtectedRoute>
        }
      />

      {/* Settings */}
      <Route
        path="/settings/*"
        element={
          <ProtectedRoute>
            <ComingSoonScreen
              title="الإعدادات"
              titleEn="Settings"
              description="إعدادات النظام والتخصيص"
              icon={Settings}
              features={[
                "الإعدادات العامة",
                "إعدادات POS",
                "المظهر والشكل",
                "بوابات الدفع",
                "الإشعارات",
                "إدارة المستخدمين",
                "التحكم بالصلاحيات",
                "التكاملات",
                "النسخ الاحتياطي",
                "سجلات النظام",
              ]}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}
