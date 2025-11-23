import { Route, Routes, Navigate } from "react-router-dom";
import LoginScreen from "./screens/login.screen";
import { useAuth } from "@/core/auth/auth.context";

const AuthRoutes = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Routes>
      <Route path="login" element={<LoginScreen />} />
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
};

export default AuthRoutes;
