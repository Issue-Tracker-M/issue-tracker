import { Router } from "express";
import {
  editComment,
  createComment,
  getComment,
  deleteComment,
} from "./controller";
import { validateCommentInput } from "./validation";
const commentRouter = Router();

commentRouter.post("/", createComment);
commentRouter.get("/:comment_id", validateCommentInput, getComment);
commentRouter.put("/:comment_id", validateCommentInput, editComment);
commentRouter.delete("/:comment_id", deleteComment);

export default commentRouter;
