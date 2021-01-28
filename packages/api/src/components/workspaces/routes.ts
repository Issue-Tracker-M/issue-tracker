import { Router } from "express";
import { checkForCredentials, checkToken } from "../auth/middleware";
import taskRouter from "../tasks/routes";
import {
  getWorkspaces,
  createWorkspace,
  editWorkspace,
  getWorkspaceById,
  deleteWorkspace,
} from "./controller";
import {
  checkUserIsWorkspaceAdmin,
  checkUserIsWorkspaceMember,
  checkWorkspaceExists,
} from "./middleware";
import { validateWorkspaceEdit, validateWorkspaceInput } from "./validation";
const workspaceRouter = Router();

workspaceRouter.use("/", checkForCredentials, checkToken);

// @route POST /api/workspace/
// @desc Add a workspace
// @access Private
workspaceRouter.post("/", validateWorkspaceInput, createWorkspace);

// @route GET /api/workspace/
// @desc Get all workspaces
// @access Private
workspaceRouter.get("/", getWorkspaces);

workspaceRouter.use(
  "/:workspace_id",
  checkWorkspaceExists,
  checkUserIsWorkspaceMember
);

// @route PUT /api/workspace/:workspace_id
// @desc Edit a workspaces's details
// @access Private
workspaceRouter.patch("/:workspace_id", validateWorkspaceEdit, editWorkspace);

// @route GET /api/workspace/:workspace_id
// @desc Get a workspaces
// @access Private
workspaceRouter.get("/:workspace_id", getWorkspaceById);

// @route DELETE /api/workspace/:workspace_id
// @desc Delete a single workspace
// @access Private
workspaceRouter.delete(
  "/:workspace_id",
  checkUserIsWorkspaceAdmin,
  deleteWorkspace
);

workspaceRouter.use("/:workspace_id/tasks", taskRouter);

export default workspaceRouter;
