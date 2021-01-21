import { Router } from "express";
import {
  getWorkspaces,
  createWorkspace,
  editWorkspace,
  getSingleWorkspace,
  deleteWorkspace,
} from "../controllers/workspace/index";
import { checkToken } from "../controllers/auth/middleware";

const router = Router();
// @route POST /api/workspace/
// @desc Add a workspace
// @access Private
router.post("/", checkToken, createWorkspace);

// @route GET /api/workspace/
// @desc Get all workspaces
// @access Private
router.get("/", checkToken, getWorkspaces);

// @route PUT /api/workspace/:workspace_id
// @desc Edit a workspaces's details
// @access Private
router.patch("/:workspace_id", checkToken, editWorkspace);

// @route GET /api/workspace/:workspace_id
// @desc Get a workspaces
// @access Private
router.get("/:workspace_id", checkToken, getSingleWorkspace);

// @route DELETE /api/workspace/:workspace_id
// @desc Delete a single workspace
// @access Private
router.delete("/:workspace_id", checkToken, deleteWorkspace);

export default router;
