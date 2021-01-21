import { AuthorizedRequest } from "../auth/middleware";
import Workspace from "../../models/Workspace";
import { Response } from "express";

async function getWorkspaces(
  req: AuthorizedRequest<void, void>,
  res: Response
): Promise<void> {
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
    res.status(500).json(err.message);
  }
}

export default getWorkspaces;
