import { Response } from "express";
import Tasks from "../../models/Task";
import Workspaces from "../../models/Workspace";
import { AuthorizedRequest } from "../auth/middleware";
import { TaskInput } from "./createTask";

export async function editTask(
  req: AuthorizedRequest<{ task_id: string }, Partial<TaskInput>>,
  res: Response
): Promise<void> {
  const { task_id } = req.params;
  const { stage, ...update } = req.body;

  try {
    const task = await Tasks.findById({ _id: task_id });
    if (!task) {
      res.status(404).json({ message: "Task not found " });
      return;
    }
    const updatedTask = await Tasks.findOneAndUpdate(
      { _id: task_id },
      { $set: update },
      { new: true }
    );
    /* 
    TODO: redo the Workspace model to have customizable columns and figure out how to best represent the tasks current position
    Also make queries/edits more palatable.
    */
    if (stage) {
      const w = await Workspaces.findById(task.workspace).exec();
      if (!w) throw new Error("Workspace not found");
      w.todo.pull(task.id);
      w.in_progress.pull(task.id);
      w.completed.pull(task.id);
      w[stage].push(task.id);
      await w.save();
    }
    res
      .status(200)
      .json({ message: "Task has been updated", data: updatedTask });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}
