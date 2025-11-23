import { Route, Routes } from "react-router-dom";
import SeatingManagementScreen from "./screens/tables.screen";

const TablesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SeatingManagementScreen />} />
    </Routes>
  );
};

export default TablesRoutes;
