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
  refreshToken,
  getInviteData,
  processInviteResponse,
  logOut,
} from "./controller";
import {
  checkForCredentials,
  authenticate,
  getUserByEmail,
} from "./middleware";
import { Router } from "express";

const router = Router();
router.post("/register", validateRegisterInput, register);
router.post("/login", validateLoginInput, getUserByEmail, login);
router.get("/logout", logOut);
router.post("/confirm_email", validateEmailConfirmation, confirmEmail);
router.post("/forgot_password", validateForgotPassword, forgotPassword);
router.post("/reset_password", validateResetPassword, resetPassword);
router.get("/refresh", refreshToken);
router.get("/invite/:invite_token", getInviteData);
router.post(
  "/invite/:invite_token",
  checkForCredentials,
  authenticate,
  processInviteResponse
);

export default router;
