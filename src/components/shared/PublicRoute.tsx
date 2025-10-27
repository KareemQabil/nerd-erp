import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading session...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect to dashboard if already logged in
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // Renders <LoginPage />
};
