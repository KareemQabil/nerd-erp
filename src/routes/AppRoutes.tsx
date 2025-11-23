import { useAuth } from "@/core/auth/auth.context";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthRoutes } from "@/features/auth/routes";
import { DashboardRoutes } from "@/features/dashboard/routes";
import { PosRoutes } from "@/features/pos/routes";
import { OrdersRoutes } from "@/features/orders/routes";
import { CustomersRoutes } from "@/features/customers/routes";
import { InventoryRoutes } from "@/features/inventory/routes";
import { TablesRoutes } from "@/features/tables/routes";
import { ReportsRoutes } from "@/features/reports/routes";
import { B2BRoutes } from "@/features/b2b/routes";
import { HRRoutes } from "@/features/hr/routes";
import { CashRoutes } from "@/features/cash/routes";
import { DeliveryRoutes } from "@/features/delivery/routes";
import { KitchenRoutes } from "@/features/kitchen/routes";
import { AnalyticsRoutes } from "@/features/analytics/routes";
import { SettingsRoutes } from "@/features/settings/routes";

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
        element={<Navigate to={user ? "/dashboard" : "/auth/login"} replace />}
      />
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/auth/login"} replace />}
      />
    </Routes>
  );
}
