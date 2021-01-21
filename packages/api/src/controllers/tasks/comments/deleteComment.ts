import { Response } from "express";
import Task from "../../../models/Task";
import { AuthorizedRequest } from "../../auth/middleware";

export const deleteComment = async (
  req: AuthorizedRequest<{ task_id: string; comment_id: string }, void>,
  res: Response
): Promise<void> => {
  const { task_id, comment_id } = req.params;
  const author_id = req.user._id;
  try {
    const task = await Task.findById(task_id).exec();
    if (!task) {
      res.status(404).end();
      return;
    }
    const comment = task.comments.id(comment_id);
    if (!comment) return res.status(404).end();
    if (comment.author.toString() !== author_id.toString())
      return res.status(401).end();
    task.comments.pull(comment_id);
    await task.save();

    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
};
