import { GenerateRecipeMiddleware } from "../../schemas/generateRecipe.js";
import { getAiRecipe } from "../../services/gemini.service.js";
import { PromptInputs } from "../../types/promptInputs.js";
import { promptBuilder } from "../../utils/promptBuilder.js";
import path from 'path';
import fs from 'fs';
import { IRecipe } from "../../types/recipeType.js";
import slugify from "slugify";
import { getRecipe, getTodayCachedRecipeCount, setRecipe } from "../../services/redis.service.js";
import { SaveRecipeMiddleware } from "../../schemas/saveRecipe.js";
import db from "../../db.js";
import { findAllRecipes, findRecipeBySlug, storeRecipe } from "../../services/recipe.service.js";
import AppError from "../../models/appError.js";
import { errors } from "../../config/errors.js";
import { GetRecipeMiddleware } from "../../schemas/getRecipe.js";
import { logger } from "../../utils/logger.js";
import { RequestHandler } from "express";

export const generateRecipe: GenerateRecipeMiddleware = async (req, res, next) => {

    const userId = req.user.id;
    let todayAttemps = await getTodayCachedRecipeCount(userId);

    if (todayAttemps >= 5) {
        next(errors.maxAttemptsReached);
    }
    const { ingredients, options, country, dishType } = req.body;
    const promptInputs: PromptInputs = {
        ingredients,
        options,
        country,
        dishType
    }

    const prompt = promptBuilder(promptInputs);

    const modelResult = await getAiRecipe(prompt);
    const cleaned = modelResult
        .replace(/^```json\s*/i, '')  // remove starting ```json (case-insensitive)
        .replace(/^```\s*/i, '')      // fallback: just ```
        .replace(/\s*```$/, '');      // remove trailing ```

    const filePath = path.join(import.meta.dirname, "./recipe.txt");
    fs.writeFileSync(filePath, cleaned);

    const finalResult: IRecipe = JSON.parse(cleaned);

    const recipeKey = slugify.default(finalResult.recipeName.toLowerCase(), { lower: true, replacement: '-', trim: true });
    console.log(recipeKey);
    await setRecipe(recipeKey, finalResult, userId);

    todayAttemps++;
    const remainingAttemps = 5 - todayAttemps

    return res.json({ finalResult, recipeKey, todayAttemps, remainingAttemps });
};

export const saveRecipe: SaveRecipeMiddleware = async (req, res) => {
    const { recipeKey } = req.params;

    const oldRecipes = await findRecipeBySlug(recipeKey, req.user.id);
    if (oldRecipes) {
        throw AppError.custom(400, 1002, "This Recipe has been saved before");
    }

    const cachedRecipe = await getRecipe(recipeKey);
    if (!cachedRecipe) {
        throw AppError.custom(400, 988, "Recipe not found in the cache");
    }

    const storedRecipe = await db.$transaction(async (tx) => {
        return await storeRecipe(tx, cachedRecipe, req.user.id);
    })

    if (storedRecipe) {
        res.json({ message: `Recipe ( ${storedRecipe.name} ) has been saved successfully!` });
    } else {
        res.status(500).json("Failed to save recipe");
    }
}

export const getRecipeData: GetRecipeMiddleware = async (req, res) => {
    const recipeKey = req.params.recipeKey;

    const cachedRecipe = await getRecipe(recipeKey);
    if (cachedRecipe) {
        return res.json(cachedRecipe);
    } else {
        logger.info("Recipe is not cached, Searching in database...")
    }


    const recipe = await findRecipeBySlug(recipeKey, req.user.id);

    if (!recipe) {
        throw AppError.custom(400, 988, "Recipe not found in the cache");
    } else {
        return res.json(recipe);
    }
}

export const getAllRecipes: RequestHandler = async (req, res) => {
    const recipes = await findAllRecipes(req.user.id);

    if (recipes.length === 0) {
        res.json({ message: "No recipes found for this user" });
        return;
    }

    res.json({ count: recipes.length, recipes })
}