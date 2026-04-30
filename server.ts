import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const PAPERLESS_URL = process.env.VITE_PAPERLESS_URL?.replace(/\/$/, "");
const PAPERLESS_TOKEN = process.env.PAPERLESS_API_TOKEN;

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Proxy Middleware
  app.all("/api/paperless/*", async (req, res) => {
    if (!PAPERLESS_URL || !PAPERLESS_TOKEN) {
      return res.status(500).json({ error: "Paperless configuration missing" });
    }

    const endpoint = req.params[0];
    const targetUrl = `${PAPERLESS_URL}/api/${endpoint}`;

    try {
      const isBinary = endpoint.includes("download") || endpoint.includes("thumb") || endpoint.includes("preview");
      const response = await axios({
        method: req.method,
        url: targetUrl,
        headers: {
          Authorization: `Token ${PAPERLESS_TOKEN}`,
          "Content-Type": String(req.headers["content-type"] || "application/json"),
        },
        params: req.query,
        data: req.body,
        responseType: isBinary ? "stream" : "json",
      });

      if (isBinary) {
        res.setHeader("Content-Type", String(response.headers["content-type"] || "application/octet-stream"));
        res.setHeader("Cache-Control", "private, max-age=300");
        response.data.pipe(res);
      } else {
        res.status(response.status).json(response.data);
      }
    } catch (error: any) {
      console.error("Paperless Proxy Error:", error.message);
      res.status(error.response?.status || 500).json(error.response?.data || { error: "Internal Server Error" });
    }
  });

  // Proxy for non-api endpoints if needed (e.g., viewing documents)
  app.get("/fetch-doc/:id", async (req, res) => {
     if (!PAPERLESS_URL || !PAPERLESS_TOKEN) return res.status(500).send("Config missing");
     const id = req.params.id;
     try {
       const response = await axios({
         method: 'get',
         url: `${PAPERLESS_URL}/api/documents/${id}/download/`,
         headers: { Authorization: `Token ${PAPERLESS_TOKEN}` },
         responseType: 'stream'
       });
       res.setHeader('Content-Type', 'application/pdf');
       response.data.pipe(res);
     } catch (e) {
       res.status(404).send("Document not found");
     }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`paperless-ui running on http://localhost:${PORT}`);
  });
}

startServer();
