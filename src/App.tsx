import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./contexts/AuthProvider";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { AppRouter } from "./routes/AppRouter";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
