import { PublicRoute } from "@/components/shared/PublicRoute";
import LoginPage from "@/pages/LoginPage";
import { type RouteObject } from "react-router-dom";

export const authRoutes: RouteObject = {
  element: <PublicRoute />,
  children: [
    {
      path: "/login",
      element: <LoginPage />,
    },
  ],
};
