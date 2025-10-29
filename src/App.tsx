import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./contexts/AuthProvider";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { AppRouter } from "./routes/AppRouter";
import { I18nProvider } from "@/features/i18n/contexts/I18nProvider";

function App() {
  return (
    <I18nProvider>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
