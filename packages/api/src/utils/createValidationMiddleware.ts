import { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";

export const createValidationMiddleware = <T>(
  schema: ObjectSchema<T>
) => async (
  req: Request<any, any, T>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};
