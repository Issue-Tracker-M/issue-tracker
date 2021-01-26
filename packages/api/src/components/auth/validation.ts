//dependencies
import Joi = require("joi");
import { createValidationMiddleware } from "../../utils/createValidationMiddleware";
// types

const passwordSchema = Joi.string().min(8).max(64).required();
const emailSchema = (): Joi.StringSchema =>
  Joi.string().lowercase().label("email").email({ minDomainSegments: 2 });

const loginSchema = Joi.object().keys({
  email: emailSchema().required(),
  password: passwordSchema,
});

const registerSchema = Joi.object().keys({
  first_name: Joi.string().alphanum().required().max(64),
  last_name: Joi.string().alphanum().required().max(64),
  password: passwordSchema,
  email: emailSchema().required(),
});

const emailConfirmation = Joi.object().keys({
  token: Joi.string().required(),
});

const forgotPassword = Joi.object().keys({
  email: emailSchema().required(),
});

const resetPassword = Joi.object().keys({
  token: Joi.string().required(),
  password: passwordSchema,
  confirmPassword: Joi.string().required().valid(Joi.ref("password")),
});

export const validateLoginInput = createValidationMiddleware(loginSchema);
export const validateRegisterInput = createValidationMiddleware(registerSchema);
export const validateEmailConfirmation = createValidationMiddleware(
  emailConfirmation
);
export const validateForgotPassword = createValidationMiddleware(
  forgotPassword
);
export const validateResetPassword = createValidationMiddleware(resetPassword);