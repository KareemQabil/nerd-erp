import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MainNavigation } from "../main-navigation";
import { NerdPOSColors, NerdPOSLayout } from "../../core/theme/nerdpos-styles";

export default function MainLayout() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div
      className={NerdPOSLayout.page.container}
      style={{ background: NerdPOSColors.background.gradient }}
    >
      <MainNavigation />

      <div
        className={NerdPOSLayout.page.main}
        style={{ marginRight: "80px" }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Outlet />
      </div>
    </div>
  );
}
