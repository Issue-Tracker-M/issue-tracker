import {
  validateEmailConfirmation,
  validateForgotPassword,
  validateLoginInput,
  validateRegisterInput,
  validateResetPassword,
} from "../controllers/auth/validation";
import {
  register,
  login,
  confirmEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth";
import { getUserByCredential } from "../controllers/auth/middleware";
import { Router } from "express";

const router = Router();
router.post("/register", validateRegisterInput, register);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
router.post("/login", validateLoginInput, getUserByCredential, login);
router.post("/confirm_email", validateEmailConfirmation, confirmEmail);
router.post("/forgot_password", validateForgotPassword, forgotPassword);
router.post("/reset_password", validateResetPassword, resetPassword);

export default router;
