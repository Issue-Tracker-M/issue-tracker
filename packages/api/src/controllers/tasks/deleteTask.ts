import { Response } from "express";
import Tasks from "../../models/Task";
import Workspaces from "../../models/Workspace";
import { AuthorizedRequest } from "../auth/middleware";

export async function deleteTask(
  req: AuthorizedRequest<{ task_id: string }, undefined>,
  res: Response
): Promise<void> {
  const taskId = req.params.task_id;

  try {
    const task = await Tasks.findOne({ _id: taskId });
    if (!task) {
      res.status(404).json({ message: "Task does not exist" });
      return;
    }
    await Tasks.deleteOne({ _id: taskId });
    const w = await Workspaces.findById(task.workspace).exec();
    if (!w) throw new Error("Workspace not found");
    w.todo.pull(task.id);
    w.in_progress.pull(task.id);
    w.completed.pull(task.id);
    await w.save();
    res.status(204).json({ message: "Task has been deleted" });
    return;
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
}
