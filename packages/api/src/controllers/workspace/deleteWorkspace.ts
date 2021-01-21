import { Response } from "express";
import Workspace from "../../models/Workspace";
import { AuthorizedRequest } from "../auth/middleware";

async function deleteWorkspace(
  req: AuthorizedRequest<{ workspace_id: string }, void>,
  res: Response
): Promise<void> {
  const workspaceId = req.params.workspace_id;

  try {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      res.status(404).json({ message: "No workspace associated with this id" });
      return;
    }
    await Workspace.deleteOne({ _id: workspaceId });
    res.status(200).json({ message: "workspace deleted" });
    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
}

export default deleteWorkspace;
