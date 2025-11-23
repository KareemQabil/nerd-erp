import { Route, Routes } from "react-router-dom";
import { ComingSoonScreen } from "@/components/coming-soon-screen";
import { Settings } from "lucide-react";

const SettingsRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ComingSoonScreen
            title="الإعدادات"
            titleEn="Settings"
            description="إعدادات النظام والتخصيص"
            icon={Settings}
            features={[
              "الإعدادات العامة",
              "إعدادات POS",
              "المظهر والشكل",
              "بوابات الدفع",
              "الإشعارات",
              "إدارة المستخدمين",
              "التحكم بالصلاحيات",
              "التكاملات",
              "النسخ الاحتياطي",
              "سجلات النظام",
            ]}
          />
        }
      />
    </Routes>
  );
};

export default SettingsRoutes;
