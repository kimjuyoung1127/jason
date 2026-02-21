/** This file exposes project list and detail API endpoints. */
import { Router } from "express";
import { projectRecords } from "../../data/projects.js";

export const projectsRouter = Router();

projectsRouter.get("/", (_req, res) => {
  res.json(projectRecords);
});

projectsRouter.get("/:slug", (req, res) => {
  const record = projectRecords.find((item) => item.slug === req.params.slug);
  if (!record) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  res.json(record);
});