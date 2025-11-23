import { Route, Routes } from "react-router-dom";
import OrdersScreen from "./screens/orders.screen";

const OrdersRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<OrdersScreen />} />
    </Routes>
  );
};

export default OrdersRoutes;
