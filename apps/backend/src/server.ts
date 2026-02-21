/** This file starts the backend API server and mounts project/contact routes. */
import cors from "cors";
import express from "express";
import { projectsRouter } from "./modules/projects/routes.js";
import { contactRouter } from "./modules/contact/routes.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "backend", date: new Date().toISOString() });
});

app.use("/projects", projectsRouter);
app.use("/contact", contactRouter);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});