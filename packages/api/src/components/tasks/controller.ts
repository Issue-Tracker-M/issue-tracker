import { AuthorizedRequest } from "../auth/middleware";
import { TaskDocument } from "./model";

type TaskInput = Pick<TaskDocument, "title" | "list">;

export const createTask = (
  req: AuthorizedRequest<unknown, TaskInput>,
  res: Response
): void => {
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
    // w.todo.pull(task.id);
    // w.in_progress.pull(task.id);
    // w.completed.pull(task.id);
    await w.save();
    res.status(204).json({ message: "Task has been deleted" });
    return;
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
}

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
      // w.todo.pull(task.id);
      // w.in_progress.pull(task.id);
      // w.completed.pull(task.id);
      // w[stage].push(task.id);
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
