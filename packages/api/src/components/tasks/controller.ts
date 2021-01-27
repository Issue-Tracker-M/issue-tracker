import { RequestHandler } from "express";
import { JSONed } from "../../utils/typeUtils";
import Tasks, { TaskDocument } from "./model";

type TaskInput = Pick<TaskDocument, "title" | "list">;

/**
 * Creates a new task given data about it's title, workspace id & list id.
 * @param req
 * @param res
 * @param next
 */
export const createTask: RequestHandler<
  { workspace_id: string },
  any,
  TaskInput
> = async (req, res, next) => {
  try {
    const workspace = req.workspace;
    if (!workspace) throw new Error("Expected workspace document in request");
    const { list } = req.body;
    const newTask = await new Tasks(req.body).save();

    const l = workspace.lists.id(list);
    if (!l) throw new Error("List not found");

    l.tasks.push(newTask._id);
    await workspace.save();
    return res.status(201).json(newTask);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Deletes a task given it's id & workspace id.
 * @param req
 * @param res
 * @param next
 */
export const deleteTask: RequestHandler = async (req, res, next) => {
  const workspace = req.workspace;
  if (!workspace) throw new Error("Expected workspace document in request");
  const task = req.task;
  if (!task) throw new Error("Expected task document in request");

  try {
    await task.remove();
    workspace.lists.id(task.list)?.tasks.pull(task._id);
    await workspace.save();

    res.status(200).send({ message: "Task has been deleted" });
  } catch (error) {
    next(error);
  }
};

/**
 * Merges the request body into task document with given id.
 * If request body contains 'list' param, also updates the workspace document containing the list.
 * @param req
 * @param res
 * @param next
 */
export const patchTask: RequestHandler<
  any,
  any,
  Partial<JSONed<TaskDocument>>
> = async (req, res, next) => {
  const workspace = req.workspace;
  if (!workspace) throw new Error("Expected workspace document in request");
  const task = req.task;
  if (!task) throw new Error("Expected task document in request");

  try {
    if (req.body.list) {
      workspace.lists.id(task.list)?.tasks.pull(task._id);
      workspace.lists.id(req.body.list)?.tasks.push(task._id);
      await workspace.save();
    }
    const updatedTask = await task
      .update({ $set: req.body }, { new: true })
      .exec();
    res.status(200).json(updatedTask);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Returns a task document with given id
 * @param req
 * @param res
 * @param next
 */
export const getTask: RequestHandler<any, any, null> = (req, res, next) => {
  try {
    const task = req.task;
    if (!task) throw new Error("Expected task document in request");
    res.status(200).json(task);
  } catch (error: unknown) {
    next(error);
  }
};
