import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const RoleGuard = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, but save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user's roles include at least one of the allowed roles
  const hasRequiredRole = user?.roles.some((role: string) =>
    allowedRoles.includes(role)
  );

  if (!hasRequiredRole) {
    // User is logged in but doesn't have permission
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // User is authenticated and has the required role
  return <Outlet />; // Renders the child route (e.g., <AdminPage />)
};
