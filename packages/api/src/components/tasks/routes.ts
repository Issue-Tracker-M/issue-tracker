import { Router } from "express";
import { checkToken } from "../controllers/auth/middleware";
import {
  createTask,
  deleteTask,
  editComment,
  editTask,
  getTask,
  createComment,
  getComment,
  deleteComment,
} from "../controllers/tasks";
const router = Router();
router.post("/", checkToken, createTask);
router.get("/:task_id", checkToken, getTask);
router.patch("/:task_id", checkToken, editTask);
router.delete("/:task_id", checkToken, deleteTask);
router.post("/:task_id/comment", checkToken, createComment);
router.get("/:task_id/comment/:comment_id", checkToken, getComment);
router.put("/:task_id/comment/:comment_id", checkToken, editComment);
router.delete("/:task_id/comment/:comment_id", checkToken, deleteComment);

export default router;
