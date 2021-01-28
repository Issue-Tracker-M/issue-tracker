import Joi from "joi";
import { createValidationMiddleware } from "../../../utils/createValidationMiddleware";

interface commentInput {
  content: string;
}

const commentInputSchema = Joi.object<commentInput>({
  content: Joi.string().required(),
});

export const validateCommentInput = createValidationMiddleware(
  commentInputSchema
);
