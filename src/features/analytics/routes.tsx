import { Route, Routes } from "react-router-dom";
import { ComingSoonScreen } from "@/components/coming-soon-screen";
import { BarChart3 } from "lucide-react";

export const AnalyticsRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ComingSoonScreen
            title="التحليلات المتقدمة"
            titleEn="Advanced Analytics"
            description="ذكاء الأعمال والتحليلات التنبؤية"
            icon={BarChart3}
            features={[
              "لوحة ذكاء الأعمال",
              "تحليلات المبيعات",
              "تحليلات المخزون",
              "تحليلات العملاء",
              "تحليل الربحية",
            ]}
          />
        }
      />
    </Routes>
  );
};
