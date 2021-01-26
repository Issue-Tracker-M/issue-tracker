import Workspace, { WorkspaceDocument } from "./model";
import { NextFunction, Response } from "express";
import { JSONed } from "../../utils/typeUtils";
import { WorkspaceInput } from "./validation";
import { AuthorizedRequest } from "../auth/middleware";

/**
 * @private
 * Creates a new workspace with a given name and assigns currently authorized user as it's admin
 * @param req - Needs to have a user document at req.user attached by previous middleware
 * @param res
 */
export const createWorkspace = async (
  req: AuthorizedRequest<unknown, WorkspaceInput>,
  res: Response
): Promise<void> => {
  const { name } = req.body;
  const { _id } = req.user;
  try {
    const newWorkSpace = await new Workspace({
      name,
      users: [_id],
      admin: _id,
    }).save();
    req.user.workspaces.push(newWorkSpace.id);
    await req.user.save();
    // await User.findOneAndUpdate(
    //   { _id },
    //   { $push: { workspaces: newWorkSpace.id } },
    //   { new: true }
    // );
    res.status(201).json(newWorkSpace);
  } catch (error: unknown) {
    res.status(500).json(error);
  }
};

/**
 * @private
 * Deletes workspace with the id given in the request params, authorized user has to be the workspace admin to delete it.
 * @param req - Needs to have a user document at req.user attached by previous middleware
 * @param res
 */
export const deleteWorkspace = async (
  req: AuthorizedRequest<{ workspace_id: string }, void>,
  res: Response
): Promise<void> => {
  const { workspace_id } = req.params;
  try {
    const workspace = await Workspace.findById(workspace_id);
    if (!workspace) {
      res.status(404).json({ message: "No workspace associated with this id" });
    } else if (workspace.admin.equals(req.user._id)) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      await Workspace.deleteOne({ _id: workspace_id });
      res.status(200).json({ message: "Workspace deleted" });
    }
  } catch (error: unknown) {
    res.status(500).json({ error });
  }
};

/**
 * @private
 * Patches the workspace with given id, authorized user has to be a member of the workspace
 * @param req - Needs to have a user document at req.user attached by previous middleware
 * @param res
 */
export const editWorkspace = async (
  req: AuthorizedRequest<{ workspace_id: string }, JSONed<WorkspaceDocument>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { workspace_id } = req.params;
  try {
    const workspace = await Workspace.findById(workspace_id).exec();
    if (!workspace) {
      res.status(404).json({ message: "Workspace not found" });
    } else if (
      // check if current user is part of the workspace
      !(
        workspace.users.includes(req.user._id) ||
        workspace.admin.equals(req.user._id)
      )
    ) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      workspace.update(req.body);

      res.status(200).json({ message: "Workspace updated" });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Returns { _id, name } of all of the workspaces associated with currently authenticated user.
 * @param req
 * @param res
 * @param next
 */
export const getWorkspaces = async (
  req: AuthorizedRequest<void, void>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user.workspaces.length) {
      res.status(404).json({ message: "No workspaces found" });
      return;
    }
    const workspacesArr = await Workspace.find(
      { admin: req.user._id },
      "_id name"
    );
    res.status(200).json(workspacesArr);
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * Returns a workspace with given id with partially populated data about it's associated tasks & users.
 * @param req
 * @param res
 * @param next
 */
export const getWorkspaceById = async (
  req: AuthorizedRequest<{ workspace_id: string }, void>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("GOT IT");
    const workspace = await Workspace.findById(req.params.workspace_id)
      .populate({ path: "lists.tasks", select: ["title", "labels"] })
      .populate({
        path: "users",
        select: ["username", "first_name", "last_name"],
      })
      .exec();
    if (!workspace) {
      res.status(404).json({ message: "Workspace with id doesnt exist" });
      return;
    }
    res.status(200).json(workspace);
    return;
  } catch (err) {
    next(err);
  }
};
