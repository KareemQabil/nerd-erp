import { RoleGuard } from "@/components/guards/role-guard";
import { AppLayout } from "@/components/layout/AppLayout";
import { ROLES_CONSTANT } from "@/constants/roles-constant";
import { Navigate, type RouteObject } from "react-router-dom";
import { authRoutes } from "@/features/auth1/auth.routes";
import { lazy } from "react";

const LazyDashboardPage = lazy(() => import("@/pages/DashboardPage"));
const LazyManagerPage = lazy(() => import("@/pages/ManagerPage"));
const LazyAdminPage = lazy(() => import("@/pages/AdminPage"));
const LazyUnauthorizedPage = lazy(() => import("@/pages/UnauthorizedPage"));
const LazyNotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export const routes: RouteObject[] = [
  authRoutes,
  {
    element: <AppLayout />,
    children: [
      {
        element: <RoleGuard allowedRoles={[ROLES_CONSTANT.EMPLOYEE]} />,
        children: [
          {
            path: "/",
            element: <LazyDashboardPage />,
          },
        ],
      },
      {
        element: (
          <RoleGuard allowedRoles={[ROLES_CONSTANT.DEPARTMENT_MANAGER]} />
        ),
        children: [
          {
            path: "/manage",
            element: <LazyManagerPage />,
          },
        ],
      },
      {
        element: <RoleGuard allowedRoles={[ROLES_CONSTANT.ADMIN]} />,
        children: [
          {
            path: "/admin",
            element: <LazyAdminPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <LazyUnauthorizedPage />,
  },
  {
    path: "/404",
    element: <LazyNotFoundPage />,
  },
  {
    path: "*",
    element: <Navigate to="/404" />,
  },
];
