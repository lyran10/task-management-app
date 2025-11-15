import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(
  express.static(path.resolve(__dirname, "../dist/client"), {
    index: false,
  })
);

app.use(async (req, res) => {
  try {
    const entryServerPath = pathToFileURL(
      path.resolve(__dirname, "../dist/server/entry-server.js")
    ).href;
    const { render } = await import(entryServerPath);

    const template = fs.readFileSync(
      path.resolve(__dirname, "../dist/client/index.html"),
      "utf-8"
    );

    const { html, styles } = await render(req.url);

    const finalHtml = template
      .replace("<!--inject-styles-->", styles)
      .replace("<!--app-->", html);

    res.status(200).setHeader("Content-Type", "text/html").send(finalHtml);
  } catch (err) {
    console.error("SSR Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () =>
  console.log("✅ SSR Server running at http://localhost:3000")
);