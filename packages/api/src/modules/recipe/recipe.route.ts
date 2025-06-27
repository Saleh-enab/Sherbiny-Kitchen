import { Router } from "express";
import { generateRecipe } from "./recipe.controller.js";

export const recipeRouter = Router();

recipeRouter.get('/generate', generateRecipe);