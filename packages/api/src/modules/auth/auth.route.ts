import { Router } from "express";
import { forgetPassword, generateNewAccessToken, generateNewEmailToken, login, logout, resetPassword, signUp, verifyEmail } from "./auth.controller.js";

export const authRouter: Router = Router();

authRouter.post('/register', signUp);
authRouter.post('/verify-email', verifyEmail);
authRouter.post('/new-email-token', generateNewEmailToken);
authRouter.post('/login', login);
authRouter.get('/logout', logout);
authRouter.post('/forget-password', forgetPassword);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/token', generateNewAccessToken);