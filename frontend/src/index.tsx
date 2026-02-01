import React from "react";
import ReactDOM from "react-dom/client";
import { GlobalStyle, SidebarRespect } from "./styles/global";
import Sidebar from "./components/Sidebar";
import { BrowserRouter } from "react-router-dom";
import { CustomThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomThemeProvider>
        <GlobalStyle />
        <Sidebar />
        <SidebarRespect>
          <Dashboard />
        </SidebarRespect>
      </CustomThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
