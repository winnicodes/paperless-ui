import express from "express";
import path from "path";
import { readFileSync } from "fs";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const rawPaperlessUrl = process.env.VITE_PAPERLESS_URL?.replace(/\/$/, "") ?? "";
const PAPERLESS_URL = rawPaperlessUrl && !rawPaperlessUrl.startsWith("http")
  ? `http://${rawPaperlessUrl}`
  : rawPaperlessUrl || undefined;
const PAPERLESS_TOKEN_ENV = process.env.PAPERLESS_API_TOKEN;

let APP_VERSION = "0.0.0";
try {
  const pkg = JSON.parse(readFileSync(path.join(process.cwd(), "package.json"), "utf-8"));
  APP_VERSION = pkg.version;
} catch { /* ignore */ }

async function startServer() {
  const app = express();
  app.use(express.json());

  // ── App config (frontend reads version + URL) ───────────────────────────
  app.get("/api/config", (_req, res) => {
    res.json({ paperlessUrl: PAPERLESS_URL ?? null, version: APP_VERSION });
  });

  // ── Auth: login → Paperless token endpoint ──────────────────────────────
  app.post("/api/auth/login", async (req, res) => {
    if (!PAPERLESS_URL) {
      return res.status(500).json({ error: "Paperless URL not configured" });
    }
    const { username, password } = req.body ?? {};
    if (!username || !password) {
      return res.status(400).json({ error: "Benutzername und Passwort erforderlich" });
    }
    try {
      const response = await axios.post(`${PAPERLESS_URL}/api/token/`, { username, password });
      res.json({ token: response.data.token });
    } catch (error: any) {
      const status = error.response?.status ?? 401;
      res.status(status).json({ error: "Ungültige Anmeldedaten" });
    }
  });

  // ── Paperless API proxy ──────────────────────────────────────────────────
  app.all("/api/paperless/*", async (req, res) => {
    if (!PAPERLESS_URL) {
      return res.status(500).json({ error: "Paperless URL not configured" });
    }

    // Token from client login takes precedence over env token
    const token = String(req.headers["x-auth-token"] || "") || PAPERLESS_TOKEN_ENV;
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const endpoint = (req.params as Record<string, string>)[0];
    const targetUrl = `${PAPERLESS_URL}/api/${endpoint}`;

    try {
      const isBinary = endpoint.includes("download") || endpoint.includes("thumb") || endpoint.includes("preview");
      const response = await axios({
        method: req.method,
        url: targetUrl,
        headers: {
          Authorization: `Token ${token}`,
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

  // ── Document download helper ─────────────────────────────────────────────
  app.get("/fetch-doc/:id", async (req, res) => {
    const token = String(req.headers["x-auth-token"] || "") || PAPERLESS_TOKEN_ENV;
    if (!PAPERLESS_URL || !token) return res.status(500).send("Config missing");
    try {
      const response = await axios({
        method: "get",
        url: `${PAPERLESS_URL}/api/documents/${req.params.id}/download/`,
        headers: { Authorization: `Token ${token}` },
        responseType: "stream",
      });
      res.setHeader("Content-Type", "application/pdf");
      response.data.pipe(res);
    } catch {
      res.status(404).send("Document not found");
    }
  });

  // ── Vite / static serving ────────────────────────────────────────────────
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
