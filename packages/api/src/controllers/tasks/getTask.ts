import { Response } from "express";
import Task from "../../models/Task";
import { AuthorizedRequest } from "../auth/middleware";

export async function getTask(
  req: AuthorizedRequest<{ task_id: string }>,
  res: Response
): Promise<void> {
  const { task_id } = req.params;
  try {
    const task = await Task.findById(task_id).exec();
    if (!task) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Couldn't get the task" });
  }
}
