import { Route, Routes } from "react-router-dom";
import CustomersScreen from "./screens/customers.screen";

export const CustomersRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CustomersScreen />} />
    </Routes>
  );
};
