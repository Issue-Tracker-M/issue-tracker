import Workspace, { WorkspaceDocument } from "../../models/Workspace";
import { Response } from "express";
import { AuthorizedRequest } from "../../controllers/auth/middleware";
import { workspaceInput } from "../../controllers/workspace/createWorkspace";
import { JSONed } from "../../utils/typeUtils";

/**
 * @private
 * Creates a new workspace with a given name and assigns currently authorized user as it's admin
 * @param req - Needs to have a user document at req.user attached by previous middleware
 * @param res
 */
export const createWorkspace = async (
  req: AuthorizedRequest<unknown, workspaceInput>,
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
 * Patches the workspace with given id, authorized user
 * @param req - Needs to have a user document at req.user attached by previous middleware
 * @param res
 */
export const editWorkspace = async (
  req: AuthorizedRequest<{ workspace_id: string }, JSONed<WorkspaceDocument>>,
  res: Response
): Promise<void> => {
  const { workspace_id } = req.params;
  const userId = req.user._id;
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
    res.status(500).json({ message: err.message });
  }
};
