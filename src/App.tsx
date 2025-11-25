import { BrowserRouter } from "react-router-dom";
// import "@/styles/global.css";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { I18nProvider } from "@/core/i18n/contexts/I18nProvider";
import { AlertDisplay } from "@/components/shared/alertDisplay";
import { Suspense } from "react";
import AppRoutes from "@/routes/AppRoutes";
import { AuthProvider } from "./core/auth/auth.context";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <I18nProvider>
      <AlertDisplay />
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <AppRoutes />
              <Toaster />
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
