import { Router } from "express";
import { generateRecipe, getAllRecipes, getRecipeData, saveRecipe } from "./recipe.controller.js";
import { authorizeUser } from "../../middlewares/authorizeUser.js";

export const recipeRouter = Router();

recipeRouter.post('/generate', generateRecipe);
recipeRouter.post('/save/:recipeKey', authorizeUser, saveRecipe);
recipeRouter.get('/:recipeKey', authorizeUser, getRecipeData);
recipeRouter.get('/', authorizeUser, getAllRecipes);