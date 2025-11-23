import { Route, Routes } from "react-router-dom";
import DashboardScreen from "./screens/dashboard.screen";

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardScreen />} />
    </Routes>
  );
};

export default DashboardRoutes;
