import { Response } from "express";
import Joi from "joi";
import Workspace, {
  Workspace as IWorkspace,
  WorkspaceDocument,
} from "../../models/Workspace";
import { AuthorizedRequest } from "../auth/middleware";

const schema = Joi.object({
  name: Joi.string().required(),

  labels: Joi.array(),
  users: Joi.array(),
  admin: Joi.string(),
  tasks: Joi.array(),
  history: Joi.array(),
});

async function editWorkspace(
  req: AuthorizedRequest<{ workspace_id: string }, WorkspaceDocument>,
  res: Response
): Promise<void> {
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json(error);
    return;
  }

  const { workspace_id } = req.params;
  try {
    const workspace = await Workspace.findByIdAndUpdate(
      workspace_id,
      req.body,
      { new: true }
    );
    if (!workspace) {
      res.status(404).json({ message: "Workspace with id doesn't exist" });
      return;
    }
    res.status(200).json({ message: "Workspace updated" });
    return;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export default editWorkspace;
