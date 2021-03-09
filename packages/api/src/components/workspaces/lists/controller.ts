import { RequestHandler } from "express";
import { ListDocument } from "../model";

export const createList: RequestHandler<
  unknown,
  unknown,
  { name: string }
> = async (req, res, next) => {
  const { user, workspace } = req;
  const { name } = req.body;
  try {
    if (!user || !workspace) throw new Error("Expected different request");
    workspace.lists.push({ name });
    await workspace.save();
    return res.status(200).json(workspace);
  } catch (error) {
    next(error);
  }
};

export const patchList: RequestHandler<
  { list_id: string },
  unknown,
  Partial<ListDocument>
> = async (req, res, next) => {
  const { user, workspace } = req;
  const { list_id } = req.params;
  try {
    if (!user || !workspace) throw new Error("Expected different request");
    const list = workspace.lists.id(list_id);
    if (!list) throw new Error("List not found");
    Object.assign(list, req.body);
    await workspace.save();
    return res.status(200).json(workspace);
  } catch (error) {
    next(error);
  }
};
