import { Router } from "express";
import { checkToken } from "../../controllers/auth/middleware";
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

export const workspaceRouter = Router();
workspaceRouter.use("/", checkToken);

// @route POST /api/workspace/
// @desc Add a workspace
// @access Private
workspaceRouter.post("/", validateWorkspaceInput, createWorkspace);

// @route GET /api/workspace/
// @desc Get all workspaces
// @access Private
workspaceRouter.get("/", getWorkspaces);

// @route PUT /api/workspace/:workspace_id
// @desc Edit a workspaces's details
// @access Private
workspaceRouter.patch(
  "/:workspace_id",
  checkUserIsWorkspaceMember,
  validateWorkspaceEdit,
  editWorkspace
);

// @route GET /api/workspace/:workspace_id
// @desc Get a workspaces
// @access Private
workspaceRouter.get(
  "/:workspace_id",
  checkWorkspaceExists,
  checkUserIsWorkspaceMember,
  getWorkspaceById
);

// @route DELETE /api/workspace/:workspace_id
// @desc Delete a single workspace
// @access Private
workspaceRouter.delete(
  "/:workspace_id",
  checkUserIsWorkspaceAdmin,
  deleteWorkspace
);
