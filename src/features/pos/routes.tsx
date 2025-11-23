import { Route, Routes } from "react-router-dom";
import POSRefinedScreen from "./screens/pos-refined.screen";
import { DemoInstructionsScreen } from "./screens/demo-instructions.screen";
import KitchenDisplayScreen from "./screens/kitchen-display.screen";
import TablesScreen from "./screens/tables.screen";
import StockScreen from "./screens/stock.screen";

const PosRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<POSRefinedScreen />} />
      <Route path="demo-instructions" element={<DemoInstructionsScreen />} />
      <Route path="kitchen-display" element={<KitchenDisplayScreen />} />
      <Route path="tables" element={<TablesScreen />} />
      <Route path="stock" element={<StockScreen />} />
    </Routes>
  );
};

export default PosRoutes;
