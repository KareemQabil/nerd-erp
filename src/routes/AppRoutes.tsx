import { lazy, Suspense } from "react";
import { useAuth } from "@/core/auth/auth.context";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/components/layouts/main-layout";

// Lazy load feature routes
const AuthRoutes = lazy(() => import("@/features/auth/routes"));
const DashboardRoutes = lazy(() => import("@/features/dashboard/routes"));
const PosRoutes = lazy(() => import("@/features/pos/routes"));
const OrdersRoutes = lazy(() => import("@/features/orders/routes"));
const CustomersRoutes = lazy(() => import("@/features/customers/routes"));
const InventoryRoutes = lazy(() => import("@/features/inventory/routes"));
const TablesRoutes = lazy(() => import("@/features/tables/routes"));
const ReportsRoutes = lazy(() => import("@/features/reports/routes"));
const B2BRoutes = lazy(() => import("@/features/b2b/routes"));
const HRRoutes = lazy(() => import("@/features/hr/routes"));
const CashRoutes = lazy(() => import("@/features/cash/routes"));
const DeliveryRoutes = lazy(() => import("@/features/delivery/routes"));
const KitchenRoutes = lazy(() => import("@/features/kitchen/routes"));
const AnalyticsRoutes = lazy(() => import("@/features/analytics/routes"));
const SettingsRoutes = lazy(() => import("@/features/settings/routes"));

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
    return <Navigate to="/auth/login" replace />;
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-[#023047] to-[#001219] flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />

        {/* Protected Routes */}
        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard/*" element={<DashboardRoutes />} />
          <Route path="/pos/*" element={<PosRoutes />} />
          <Route path="/orders/*" element={<OrdersRoutes />} />
          <Route path="/customers/*" element={<CustomersRoutes />} />
          <Route path="/inventory/*" element={<InventoryRoutes />} />
          <Route path="/seating/*" element={<TablesRoutes />} />
          <Route path="/reports/*" element={<ReportsRoutes />} />
          <Route path="/b2b/*" element={<B2BRoutes />} />
          <Route path="/hr/*" element={<HRRoutes />} />
          <Route path="/cash/*" element={<CashRoutes />} />
          <Route path="/delivery/*" element={<DeliveryRoutes />} />
          <Route path="/kitchen/*" element={<KitchenRoutes />} />
          <Route path="/analytics/*" element={<AnalyticsRoutes />} />
          <Route path="/settings/*" element={<SettingsRoutes />} />
        </Route>

        {/* Redirects */}
        <Route
          path="/"
          element={
            <Navigate to={user ? "/dashboard" : "/auth/login"} replace />
          }
        />
        <Route
          path="*"
          element={
            <Navigate to={user ? "/dashboard" : "/auth/login"} replace />
          }
        />
      </Routes>
    </Suspense>
  );
}
