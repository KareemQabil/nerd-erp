import { Route, Routes } from "react-router-dom";
import { ComingSoonScreen } from "@/components/coming-soon-screen";
import { Truck } from "lucide-react";

const DeliveryRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ComingSoonScreen
            title="إدارة التوصيل"
            titleEn="Delivery Management"
            description="نظام متكامل لإدارة التوصيل والسائقين"
            icon={Truck}
            features={[
              "لوحة التوصيل",
              "طلبات التوصيل",
              "إدارة السائقين",
              "التتبع المباشر",
              "مناطق التوصيل",
              "تقارير التوصيل",
            ]}
          />
        }
      />
    </Routes>
  );
};

export default DeliveryRoutes;
