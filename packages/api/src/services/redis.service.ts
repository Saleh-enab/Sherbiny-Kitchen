import { redis } from "../db.js";
import AppError from "../models/appError.js";
import { IRecipe } from "../types/recipeType.js";
import { logger } from "../utils/logger.js";

export const setRecipe = async (key: string, data: IRecipe, userId: string) => {
    const oldRecipes = await redis.get(key);

    if (oldRecipes) {
        logger.info("Cache hit!, This recipe is already exits");
        return;
    }

    const requestPayload = {
        recipe: data,
        requestedAt: new Date().toISOString(),
        userId
    };

    const recipeJson = JSON.stringify(requestPayload);
    const expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
    const ttlSeconds = Math.floor((expireAt.getTime() - Date.now()) / 1000);

    await redis.setex(key, ttlSeconds, recipeJson, (err) => {
        if (err) {
            throw AppError.custom(500, 1999, err.message)
        } else {
            logger.info("Recipe saved in cache successfully");
        }
    });
}

export const getRecipe = async (key: string) => {
    const cachedData = await redis.get(key);
    if (!cachedData) {
        return null;
    }
    const parsed = JSON.parse(cachedData);
    const cachedRecipe: IRecipe = parsed.recipe;
    return cachedRecipe;
}

export const getTodayCachedRecipeCount = async (userId: string) => {
    const keys = await redis.keys("*");

    if (!keys || keys.length === 0) {
        console.log("No Keys");
        return 0;
    }

    let count = 0;

    for (const key of keys) {
        const value = await redis.get(key);

        if (value) {
            const { requestedAt, userId: cachedUserId } = JSON.parse(value);

            if (cachedUserId === userId && isToday(requestedAt)) {
                count++;
            }
        }
    }

    return count;
};


// Check if ISO string date is from today
const isToday = (isoString: string) => {
    const today = new Date();
    const date = new Date(isoString);

    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
};