import { Router } from "express";
import { generateNewEmailToken, signUp, verifyEmail } from "./auth.controller.js";

export const authRouter: Router = Router();

authRouter.post('/register', signUp);
authRouter.post('/verify-email', verifyEmail)
authRouter.post('/new-email-token', generateNewEmailToken)