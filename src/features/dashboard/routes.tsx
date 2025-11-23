import { Route, Routes } from "react-router-dom";
import DashboardScreen from "./screens/dashboard.screen";

export const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardScreen />} />
    </Routes>
  );
};
