import { Route, Routes } from "react-router-dom";
import { ComingSoonScreen } from "@/components/coming-soon-screen";
import { ChefHat } from "lucide-react";

const KitchenRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ComingSoonScreen
            title="إدارة المطبخ"
            titleEn="Kitchen Management"
            description="نظام عرض المطبخ وإدارة الوصفات"
            icon={ChefHat}
            features={[
              "شاشة عرض المطبخ",
              "إدارة المحطات",
              "إدارة الوصفات",
              "إدارة الهدر",
            ]}
          />
        }
      />
    </Routes>
  );
};

export default KitchenRoutes;
