import { Response } from "express";
import Task from "../../../models/Task";
import { AuthorizedRequest } from "../../auth/middleware";

export const getComment = async (
  req: AuthorizedRequest<{ task_id: string; comment_id: string }>,
  res: Response
): Promise<void> => {
  const { task_id, comment_id } = req.params;
  try {
    const task = await Task.findById(task_id).exec();
    if (!task) {
      res.status(404).end();
      return;
    }
    const c = task.comments.id(comment_id);
    if (c) {
      res.status(200).json(c);
    } else res.status(404).end();
  } catch (error) {
    res.status(500).end();
  }
};
