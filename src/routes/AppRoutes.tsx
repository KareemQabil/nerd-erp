import { lazy, Suspense } from "react";
import { useAuth } from "@/core/auth/auth.context";
import { Routes, Route, Navigate } from "react-router-dom";

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
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pos/*"
          element={
            <ProtectedRoute>
              <PosRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/*"
          element={
            <ProtectedRoute>
              <OrdersRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers/*"
          element={
            <ProtectedRoute>
              <CustomersRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory/*"
          element={
            <ProtectedRoute>
              <InventoryRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seating/*"
          element={
            <ProtectedRoute>
              <TablesRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/*"
          element={
            <ProtectedRoute>
              <ReportsRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/b2b/*"
          element={
            <ProtectedRoute>
              <B2BRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/*"
          element={
            <ProtectedRoute>
              <HRRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cash/*"
          element={
            <ProtectedRoute>
              <CashRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery/*"
          element={
            <ProtectedRoute>
              <DeliveryRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kitchen/*"
          element={
            <ProtectedRoute>
              <KitchenRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/*"
          element={
            <ProtectedRoute>
              <AnalyticsRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/*"
          element={
            <ProtectedRoute>
              <SettingsRoutes />
            </ProtectedRoute>
          }
        />

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
