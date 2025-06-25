import { Router } from "express";
import { signUp } from "./auth.controller.js";

export const authRouter: Router = Router();

authRouter.post('/register', signUp);