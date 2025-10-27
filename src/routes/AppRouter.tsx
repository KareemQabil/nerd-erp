import { RoleGuard } from "@/guards/role-guard";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import ManagerPage from "@/pages/ManagerPage";
import { Route, Routes } from "react-router-dom";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { ROLES_CONSTANT } from "@/constants/roles-constant";
import { AppLayout } from "@/components/layout/AppLayout";
import { PublicRoute } from "@/components/shared/PublicRoute";
import AdminPage from "@/pages/AdminPage";

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Authenticated Routes with Shared Layout */}
      <Route element={<AppLayout />}>
        {/* Route: / (Dashboard)
              - Allowed: EMPLOYEE (which admin and manager also have) */}
        <Route element={<RoleGuard allowedRoles={[ROLES_CONSTANT.EMPLOYEE]} />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>

        {/* Route: /manage
              - Allowed: DEPARTMENT_MANAGER */}
        <Route
          element={
            <RoleGuard allowedRoles={[ROLES_CONSTANT.DEPARTMENT_MANAGER]} />
          }
        >
          <Route path="/manage" element={<ManagerPage />} />
        </Route>

        {/* Route: /admin
              - Allowed: ADMIN */}
        <Route element={<RoleGuard allowedRoles={[ROLES_CONSTANT.ADMIN]} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Route>
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Other Routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
