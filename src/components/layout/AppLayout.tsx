import { useAuth } from "@/hooks/useAuth";
import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageSwitcher } from "@/features/i18n";

export const AppLayout = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card shadow-sm">
        <div className="container px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <span className="text-lg font-bold text-primary">
                {t("common.appName")}
              </span>
              {/* Nav Links */}
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("navigation.dashboard")}
              </Link>
              <Link
                to="/manage"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("navigation.management")}
              </Link>
              <Link
                to="/admin"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("navigation.admin")}
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-foreground">
                {t("common.welcome")}, {user?.fullNameEn}
              </span>
              <LanguageSwitcher />
              <ThemeToggle />
              <button
                onClick={signOut}
                className="px-3 py-1 text-sm font-medium text-destructive-foreground bg-destructive rounded-md hover:bg-destructive/90 transition-colors"
              >
                {t("common.logout")}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="container p-8 mx-auto max-w-7xl">
        <Outlet /> {/* Child routes will render here */}
      </main>
    </div>
  );
};
