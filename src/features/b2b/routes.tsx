import { Route, Routes } from "react-router-dom";
import { ComingSoonScreen } from "@/components/coming-soon-screen";
import { Building2 } from "lucide-react";

export const B2BRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ComingSoonScreen
            title="مبيعات B2B"
            titleEn="B2B Sales"
            description="نظام مبيعات الجملة للعملاء التجاريين"
            icon={Building2}
            features={[
              "لوحة معلومات B2B",
              "العملاء التجاريين",
              "عروض الأسعار",
              "طلبات B2B",
              "الفواتير والمدفوعات",
            ]}
          />
        }
      />
    </Routes>
  );
};
