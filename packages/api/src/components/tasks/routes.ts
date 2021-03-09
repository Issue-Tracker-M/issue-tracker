import { Router } from "express";
import { createTask, deleteTask, patchTask, getTask } from "./controller";
import { checkTaskExists, userHasAccessToTask } from "./middleware";
import commentRouter from "./comments/routes";
import { authenticate } from "../auth/middleware";
const router = Router();
router.use("/", authenticate);
router.post("/", createTask);
router.use("/:task_id", checkTaskExists, userHasAccessToTask);
router.get("/:task_id", getTask);
router.patch("/:task_id", patchTask);
router.delete("/:task_id", deleteTask);
router.use("/:task_id/comments", commentRouter);

export default router;
