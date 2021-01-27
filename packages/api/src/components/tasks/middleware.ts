import { RequestHandler } from "express";
import Tasks from "./model";

export const checkTaskExists: RequestHandler = async (req, res, next) => {
  try {
    const { task_id } = req.params;
    const task = await Tasks.findById(task_id).exec();
    if (!task) return res.status(404).json({ message: "Not found" });
    req.task = task;
    next();
  } catch (error: unknown) {
    next(error);
  }
};
