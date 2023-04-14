import express, { Application } from "express";
import "dotenv/config";
import {
  checkDeveloperHaveInfo,
  checkEmailExists,
  checkIdExists,
} from "./middlewares/developers.middlewares";
import {
  createDeveloper,
  createDeveloperInfo,
  deleteDeveloper,
  getDeveloperById,
  updateDeveloper,
} from "./logics/developers.logics";
import {
  addTechnologieToProject,
  createProject,
  deleteProject,
  getProjectById,
  updateProject,
} from "./logics/projects.logics";
import {
  checkDeveloperIdExists,
  checkIdProjectExists,
  checkTechnologyName,
} from "./middlewares/projects.middlewares";

const app: Application = express();
app.use(express.json());

app.post("/developers", checkEmailExists, createDeveloper);
app.get("/developers/:id", checkIdExists, getDeveloperById);
app.patch("/developers/:id", checkIdExists, checkEmailExists, updateDeveloper);
app.delete("/developers/:id", checkIdExists, deleteDeveloper);
app.post(
  "/developers/:id/infos",
  checkIdExists,
  checkDeveloperHaveInfo,
  createDeveloperInfo
);

app.post("/projects", checkDeveloperIdExists, createProject);
app.get("/projects/:id", checkIdProjectExists, getProjectById);
app.patch(
  "/projects/:id",
  checkIdProjectExists,
  checkDeveloperIdExists,
  updateProject
);
app.delete("/projects/:id", checkIdProjectExists, deleteProject);
app.post(
  "/projects/:id/technologies",
  checkIdProjectExists,
  checkTechnologyName,
  addTechnologieToProject
);
app.delete("/projects/:id/technologies/:name");

export default app;
