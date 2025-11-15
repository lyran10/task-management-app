import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { CacheProvider } from "@emotion/react";
import { ThemeModeProvider } from "./context/themeModeContext";
import { CssBaseline } from "@mui/material";
import { AuthProvider } from "./context/authContext";
import createCache from "@emotion/cache";

const cache = createCache({ key: "css", prepend: true });

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <CacheProvider value={cache}>
      <ThemeModeProvider>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeModeProvider>
    </CacheProvider>
  </React.StrictMode>
);
