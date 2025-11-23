import { Route, Routes } from "react-router-dom";
import { ComingSoonScreen } from "@/components/coming-soon-screen";
import { UserCog } from "lucide-react";

const HRRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ComingSoonScreen
            title="إدارة الموظفين"
            titleEn="Human Resources"
            description="نظام شامل لإدارة الموارد البشرية"
            icon={UserCog}
            features={[
              "إدارة الموظفين",
              "الحضور والمناوبات",
              "الرواتب",
              "تقييم الأداء",
              "التدريب والتطوير",
              "إدارة الإجازات",
            ]}
          />
        }
      />
    </Routes>
  );
};

export default HRRoutes;
