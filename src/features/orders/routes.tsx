import { Route, Routes } from "react-router-dom";
import OrdersScreen from "./screens/orders.screen";

export const OrdersRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<OrdersScreen />} />
    </Routes>
  );
};
