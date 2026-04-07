import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AppRoutes from "./routes";
import { ThemeProvider } from "./components/theme-provider";
import { LanguageProvider } from "./components/language-provider";
import { useCrossTabLogout } from "./hooks/useCrossTabLogout";
import FaviconManager from "./components/FaviconManager";
import "./App.css";

const CrossTabLogoutHandler = () => {
  useCrossTabLogout();
  return null;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="eduplatform-theme">
        <LanguageProvider defaultLanguage="en" storageKey="ai-tutor-language">
          <Router>
            <CrossTabLogoutHandler />
            <FaviconManager />
            <AppRoutes />
            <Toaster position="top-right" offset={{ right: 85, top: 16 }} />
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
