import { Route, Routes } from "react-router-dom";
import SeatingManagementScreen from "./screens/tables.screen";

export const TablesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SeatingManagementScreen />} />
    </Routes>
  );
};
