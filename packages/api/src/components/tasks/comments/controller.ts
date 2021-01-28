import { Response } from "express";
import { AuthorizedRequest } from "../../auth/middleware";
import { CommentDocument } from "../model";

/**
 * Creates a new comment within a given task
 * @param req
 * @param res
 */
export const createComment = async (
  req: AuthorizedRequest<{ task_id: string }, Pick<CommentDocument, "content">>,
  res: Response
): Promise<any> => {
  const task = req.task;
  const author = req.user._id;
  const { content } = req.body;
  if (!task) return res.sendStatus(404);
  try {
    const commentIndex = task.comments.push({ author, content }) - 1;
    await task.save();
    res.status(201).json(task.comments[commentIndex]);
  } catch (error) {
    res.status(500).end();
  }
};

/**
 * Deletes comment with given id
 * @param req
 * @param res
 */
export const deleteComment = async (
  req: AuthorizedRequest<{ task_id: string; comment_id: string }, void>,
  res: Response
): Promise<any> => {
  const { comment_id } = req.params;
  const author_id = req.user._id;
  const task = req.task;
  if (!task) return res.sendStatus(404);

  try {
    // No comment with such id
    const comment = task.comments.id(comment_id);
    if (!comment) return res.status(404).end();
    // User is not the author of the comment
    if (!comment.author.equals(author_id)) return res.status(401).end();

    task.comments.pull(comment_id);
    await task.save();
    return res.status(200).end();
  } catch (error) {
    return res.status(500).end();
  }
};

export const editComment = async (
  req: AuthorizedRequest<
    { task_id: string; comment_id: string },
    { content: string }
  >,
  res: Response
): Promise<any> => {
  const { comment_id } = req.params;
  const authorId = req.user._id;
  const task = req.task;
  if (!task) return res.sendStatus(404);

  try {
    const comment = task.comments.id(comment_id);
    if (!comment) return res.status(404).end();
    if (comment.author.toString() !== authorId.toString())
      return res.status(401).end();
    comment.set(req.body);
    await task.save();
    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
};

export const getComment = (
  req: AuthorizedRequest<{ comment_id: string }>,
  res: Response
): any => {
  const { comment_id } = req.params;
  const task = req.task;
  if (!task) return res.sendStatus(404);

  try {
    const c = task.comments.id(comment_id);
    if (c) {
      res.status(200).json(c);
    } else res.status(404).end();
  } catch (error) {
    res.status(500).end();
  }
};
