import { Route, Routes } from "react-router-dom";
import InventoryScreen from "./screens/inventory.screen";

const InventoryRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<InventoryScreen />} />
    </Routes>
  );
};

export default InventoryRoutes;
