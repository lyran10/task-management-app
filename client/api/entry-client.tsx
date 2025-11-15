import { StrictMode } from 'react'
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom'
import '../src/index.css'
import { App } from '../src/App'
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';
import { ThemeModeProvider } from '../src/context/themeModeContext';
import { AuthProvider } from '../src/context/authContext';
import { CssBaseline } from '@mui/material';
const cache = createEmotionCache();


hydrateRoot(
  document.getElementById("root")!,
  <CacheProvider value={cache}>
     <ThemeModeProvider>
      <CssBaseline />
      <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </ThemeModeProvider>
  </CacheProvider>
);