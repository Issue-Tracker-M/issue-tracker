import {
  validateEmailConfirmation,
  validateForgotPassword,
  validateLoginInput,
  validateRegisterInput,
  validateResetPassword,
} from "./validation";
import {
  register,
  login,
  confirmEmail,
  forgotPassword,
  resetPassword,
} from "./controller";
import { getUserByEmail } from "./middleware";
import { Router } from "express";

const router = Router();
router.post("/register", validateRegisterInput, register);
router.post("/login", validateLoginInput, getUserByEmail, login);
router.post("/confirm_email", validateEmailConfirmation, confirmEmail);
router.post("/forgot_password", validateForgotPassword, forgotPassword);
router.post("/reset_password", validateResetPassword, resetPassword);

export default router;
