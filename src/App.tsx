import { BrowserRouter } from "react-router-dom";
import "@/App.css";
import { AuthProvider } from "@/contexts/AuthProvider";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AppRouter } from "@/routes/AppRouter";
import { I18nProvider } from "@/features/i18n/contexts/I18nProvider";
import { AlertDisplay } from "@/components/shared/alertDisplay";
import { Suspense } from "react";

function App() {
  return (
    <I18nProvider>
      <AlertDisplay />
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <AppRouter />
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
