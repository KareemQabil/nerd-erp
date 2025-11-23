import { Route, Routes } from "react-router-dom";
import { ComingSoonScreen } from "@/components/coming-soon-screen";
import { TrendingUp } from "lucide-react";

export const ReportsRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ComingSoonScreen
            title="التقارير والتحليلات"
            titleEn="Reports & Analytics"
            description="تقارير شاملة وتحليلات متقدمة"
            icon={TrendingUp}
            features={[
              "لوحة التقارير",
              "تقارير المبيعات",
              "تقارير المخزون",
              "تقارير العملاء",
              "تقارير الموظفين",
              "التقارير المالية",
              "منشئ تقارير مخصص",
            ]}
          />
        }
      />
    </Routes>
  );
};
