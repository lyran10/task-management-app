import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { App } from "../src/App";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import createEmotionCache from "../src/createEmotionCache";
import { ThemeModeProvider } from "../src/context/themeModeContext";
import { AuthProvider } from "../src/context/authContext";
import { CssBaseline } from "@mui/material";

export function render(url: string) {
  const cache = createEmotionCache();
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(cache);

  const app = (
    <CacheProvider value={cache}>
      <ThemeModeProvider>
        <CssBaseline />
        <AuthProvider>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </AuthProvider>
      </ThemeModeProvider>
    </CacheProvider>
  );

  const html = ReactDOMServer.renderToString(app);

  const chunks = extractCriticalToChunks(html);
  const styles = constructStyleTagsFromChunks(chunks);

  return { html, styles };
}
