import { Response } from "express";
import Task, { TaskDocument } from "../../models/Task";
import Workspaces from "../../models/Workspace";
import { AuthorizedRequest } from "../auth/middleware";

export interface TaskInput extends TaskDocument {
  stage: "todo" | "in_progress" | "completed";
}

export const createTask = async (
  req: AuthorizedRequest<unknown, TaskInput>,
  res: Response
): Promise<void> => {
  const { workspace, stage } = req.body;

  const newTask = new Task(req.body);

  newTask
    .save()
    .then(async (task) => {
      await Workspaces.findByIdAndUpdate(workspace, {
        $push: { [stage]: task.id },
      });
      res.status(201).json(task);
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};
