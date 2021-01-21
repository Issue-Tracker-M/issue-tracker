import Joi from "joi";
import Workspace, { Label } from "../../models/Workspace";
import User from "../../models/User";
import { Response } from "express";
import { AuthorizedRequest } from "../../controllers/auth/middleware";

export interface workspaceInput {
  name: string;
  labels?: Label[];
}

const schema = Joi.object({
  name: Joi.string().required(),
  labels: Joi.array(),
});

const createWorkspace = (
  req: AuthorizedRequest<unknown, workspaceInput>,
  res: Response
): void => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(400).json(error);
    return;
  }

  const { name, labels } = req.body;
  const { _id } = req.user;

  const newWorkSpace = new Workspace({
    name,
    labels,
    users: [_id],
    admin: _id,
    tasks: [],
    history: [],
  });

  newWorkSpace
    .save()
    .then(async (workspace) => {
      await User.findOneAndUpdate(
        { _id },
        { $push: { workspaces: workspace } },
        { new: true }
      );
      res.status(201).json(workspace);
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

export default createWorkspace;
