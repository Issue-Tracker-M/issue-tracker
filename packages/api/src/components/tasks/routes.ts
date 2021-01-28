import { Router } from "express";
import { createTask, deleteTask, patchTask, getTask } from "./controller";
import { checkTaskExists } from "./middleware";
import commentRouter from "./comments/routes";
const router = Router();
router.post("/", createTask);
router.use("/:task_id", checkTaskExists);
router.get("/:task_id", getTask);
router.patch("/:task_id", patchTask);
router.delete("/:task_id", deleteTask);
router.use("/:task_id/comments", commentRouter);

export default router;
