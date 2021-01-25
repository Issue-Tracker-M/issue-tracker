import { RequestHandler } from "express";
import Workspaces from "../../models/Workspace";

export const getWorkspaceById: RequestHandler = async (req, res, next) => {
  const { workspace_id } = req.params;
  try {
    const workspace = await Workspaces.findById(workspace_id).exec();
    if (!workspace) return res.status(404).json({ message: "Not found" });
    req.workspace = workspace;
  } catch (error: unknown) {
    next(error);
  }
};

export const checkUserIsWorkspaceAdmin: RequestHandler = (req, res) => {
  const userId = req.user?._id;
  if (!req.workspace?.admin.equals(userId!))
    return res.status(401).json({ message: "Unauthorized" });
  return;
};
