import { Router } from "express";
import { getAllIngredients } from "./ingredient.controller.js";

export const ingredientRouter = Router();

ingredientRouter.get('/', getAllIngredients);