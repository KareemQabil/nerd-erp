import { Route, Routes } from "react-router-dom";
import { ComingSoonScreen } from "@/components/coming-soon-screen";
import { DollarSign } from "lucide-react";

const CashRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ComingSoonScreen
            title="إدارة النقدية"
            titleEn="Cash Management"
            description="نظام إدارة الصندوق والتقفيلة اليومية"
            icon={DollarSign}
            features={[
              "الصندوق النقدي",
              "التقفيلة اليومية",
              "معاملات النقدية",
              "التسويات البنكية",
            ]}
          />
        }
      />
    </Routes>
  );
};

export default CashRoutes;
