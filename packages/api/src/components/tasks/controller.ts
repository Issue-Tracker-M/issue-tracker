import { RequestHandler } from "express";
import { JSONed } from "../../utils/typeUtils";
import Workspaces from "../workspaces/model";
import Tasks, { TaskDocument } from "./model";

type TaskInput = Pick<TaskDocument, "title" | "list" | "workspace">;

/**
 * Creates a new task given data about it's title, workspace id & list id.
 * @param req
 * @param res
 * @param next
 */
export const createTask: RequestHandler<unknown, unknown, TaskInput> = async (
  req,
  res,
  next
) => {
  const { user } = req;
  const { workspace, list } = req.body;
  try {
    if (!user?.workspaces.includes(workspace)) return res.sendStatus(401);
    const w = await Workspaces.findById(workspace).exec();
    if (!w) throw new Error("Workspace not found");
    const newTask = await Tasks.create(req.body);

    const l = w.lists.id(list);
    if (!l) throw new Error("List not found");

    l.tasks.push(newTask._id);
    await w.save();
    return res.status(201).json(newTask);
  } catch (error) {
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
  const { task, user } = req;
  if (!task) throw new Error("Expected task document in request");
  if (!user) throw new Error("Expected user document in request");
  const workspace_id = task.workspace;

  try {
    const workspace = await Workspaces.findById(workspace_id).exec();
    if (!workspace) throw new Error("Expected workspace document in request");
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
  unknown,
  unknown,
  Partial<JSONed<TaskDocument>>
> = async (req, res, next) => {
  const { task, user } = req;
  if (!task) throw new Error("Expected task document in request");
  if (!user) throw new Error("Expected user document in request");
  try {
    const workspace = await Workspaces.findById(task.workspace).exec();
    if (!workspace)
      throw new Error("This task doesn't belong to any workspace");

    if (req.body.list) {
      workspace.lists.id(task.list)?.tasks.pull(task._id);
      workspace.lists.id(req.body.list)?.tasks.push(task._id);
      await workspace.save();
    }
    Object.assign(task, req.body);
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * Returns a task document with given id
 * @param req
 * @param res
 * @param next
 */
export const getTask: RequestHandler<unknown, unknown, null> = (
  req,
  res,
  next
) => {
  try {
    const task = req.task;
    if (!task) throw new Error("Expected task document in request");
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};
