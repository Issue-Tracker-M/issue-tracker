import { RequestHandler } from "express";
import Tasks from "./model";

export const checkTaskExists: RequestHandler = async (req, res, next) => {
  try {
    const { task_id } = req.params;
    const task = await Tasks.findById(task_id).exec();
    if (!task) return res.status(404).json({ message: "Not found" });
    req.task = task;
    next();
  } catch (error) {
    next(error);
  }
};

export const userHasAccessToTask: RequestHandler = (req, res, next) => {
  try {
    const { task, user } = req;
    if (user && task && user.workspaces.includes(task.workspace)) return next();
    return res.sendStatus(401);
  } catch (error) {
    next(error);
  }
};
