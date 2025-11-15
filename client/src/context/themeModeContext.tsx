import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

type ThemeMode = "light" | "dark";

interface ThemeModeContextType {
  mode: ThemeMode;
  toggle: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("tm_mode") as ThemeMode | null;
    if (stored) setMode(stored);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) localStorage.setItem("tm_mode", mode);
  }, [mode, isHydrated]);

  const toggle = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#1976d2" : "#90caf9",
      },
      background: {
        default: mode === "light" ? "#fafafa" : "#121212",
        paper: mode === "light" ? "#fff" : "#1e1e1e",
      },
    },
  });

  if (!isHydrated) {
    return (
      <ThemeModeContext.Provider value={{ mode, toggle }}>
        <ThemeProvider theme={theme}>
          <div style={{ visibility: "hidden" }}>{children}</div>
        </ThemeProvider>
      </ThemeModeContext.Provider>
    );
  }

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export const useThemeMode = (): ThemeModeContextType => {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error("useThemeMode must be used within ThemeModeProvider");
  return ctx;
};
