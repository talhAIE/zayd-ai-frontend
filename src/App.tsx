import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AppRoutes from "./routes";
import { ThemeProvider } from "./components/theme-provider";
import { useCrossTabLogout } from "./hooks/useCrossTabLogout";
import "./App.css";

const CrossTabLogoutHandler = () => {
  useCrossTabLogout();
  return null;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="eduplatform-theme">
        <Router>
          <CrossTabLogoutHandler />
          <AppRoutes />
          <Toaster position="top-right" />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
