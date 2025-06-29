import slugify from "slugify";
import db from "../db.js";
import { IRecipe } from "../types/recipeType.js";
import { Prisma } from "../generated/prisma/client.js";

export const storeRecipe = async (tx: Prisma.TransactionClient, recipeData: IRecipe, userId: string) => {

    const recipeSlug = slugify
        .default(recipeData.recipeName.toLowerCase(), { lower: true, replacement: '-', trim: true });
    const recipeName = recipeData.recipeName;
    const recipeCountry = recipeData.country;
    const recipeIngredients = recipeData.ingredients;
    const recipeSteps = recipeData.steps;
    const recipeTime = recipeData.timeInMinutes;

    const newRecipe = await tx.recipe.create({
        data: {
            slug: recipeSlug,
            name: recipeName,
            country: recipeCountry,
            userId,
            steps: recipeSteps,
            timeInMinutes: recipeTime
        }
    });

    for (const ingredient of recipeIngredients) {
        const ingredientSlug = slugify
            .default(ingredient.name.toLowerCase(), { lower: true, replacement: '-', trim: true });


        await tx.recipeToIngredient.create({
            data: {
                recipeSlug,
                ingredientSlug,
                measure: ingredient.measure,
                quantity: ingredient.quantity
            }
        });
    }

    return newRecipe;
}

export const findRecipeBySlug = async (recipeSlug: string, userId: string) => {
    const recipe = await db.recipe.findUnique({
        where: {
            slug: recipeSlug,
            userId
        },
        include: {
            RecipeToIngredient: {
                include: {
                    Ingredient: true
                }
            }
        }
    })

    return recipe;
}

export const findAllRecipes = async (userId: string) => {
    const recipes = await db.recipe.findMany({
        where: {
            userId
        },
        include: {
            RecipeToIngredient: {
                include: {
                    Ingredient: true
                }
            }
        }
    })

    return recipes;
}