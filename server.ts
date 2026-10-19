import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { apiApp } from "./server/app.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Mount API routes
app.use(apiApp);

// Serve static assets from dist in production
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// Fallback to index.html for client routing
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Vāc Sanskrit AI Guru server listening on port ${PORT}`);
});
