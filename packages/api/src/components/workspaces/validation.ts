import Joi from "joi";
import { WorkspaceDocument } from "../../models/Workspace";
import { createValidationMiddleware } from "../../utils/createValidationMiddleware";

export type WorkspaceInput = Pick<WorkspaceDocument, "name">;

const workspaceInput = Joi.object({
  name: Joi.string().required(),
});

export const validateWorkspaceInput = createValidationMiddleware(
  workspaceInput
);

const workspaceEdit = Joi.object({
  name: Joi.string(),
  admin: Joi.string(),
  users: Joi.array().items(Joi.string().required()),
  labels: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      color: Joi.string().required(),
    }).required()
  ),
  lists: Joi.array().items(Joi.string().required()),
}).xor("name", "admin", "users", "labels", "lists");

export const validateWorkspaceEdit = createValidationMiddleware(workspaceEdit);
