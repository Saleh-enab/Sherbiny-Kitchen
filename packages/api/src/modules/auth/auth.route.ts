import { Router } from "express";
import { generateNewEmailToken, login, logout, signUp, verifyEmail } from "./auth.controller.js";

export const authRouter: Router = Router();

authRouter.post('/register', signUp);
authRouter.post('/verify-email', verifyEmail);
authRouter.post('/new-email-token', generateNewEmailToken);
authRouter.post('/login', login);
authRouter.get('/logout', logout);