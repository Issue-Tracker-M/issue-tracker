import { RequestHandler } from "express";
import Workspaces from "./model";

/**
 * Checks whether workspace with given id exists in the db
 * @param req
 * @param res
 */
export const checkWorkspaceExists: RequestHandler = async (req, res, next) => {
  const { workspace_id } = req.params;
  try {
    const workspace = await Workspaces.findById(workspace_id).exec();
    if (!workspace) return res.status(404).json({ message: "Not found" });
    req.workspace = workspace;
    next();
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Checks whether currently authenticated user is an admin of the current workspace
 * @param req
 * @param res
 */
export const checkUserIsWorkspaceAdmin: RequestHandler = (req, res, next) => {
  const { user } = req;
  if (!user) throw new Error("Expected user document in the request");
  if (!req.workspace)
    throw new Error("Expected workspace document in the request");
  if (!req.workspace.admin.equals(user._id))
    return res.status(401).json({ message: "Unauthorized" });
  return next();
};

/**
 * Checks whether currently authenticated user is a member of the current workspace
 * @param req - Needs req.user to be a {@link @issue-tracker/api#UserDocument} & req.workspace to be a {@link @issue-tracker/api#WorkspaceDocument}
 * @param res
 */
export const checkUserIsWorkspaceMember: RequestHandler = (req, res, next) => {
  const { user } = req;
  if (!user) throw new Error("Expected user document in the request");
  if (!req.workspace)
    throw new Error("Expected workspace document in the request");
  if (
    !(
      req.workspace.users.includes(user._id) ||
      req.workspace.admin.equals(user._id)
    )
  )
    return res.status(401).json({ message: "Unauthorized" });
  return next();
};
