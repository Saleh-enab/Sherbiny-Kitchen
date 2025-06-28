import { Measure } from "../generated/prisma/enums.js";

export interface RecipeIngredient {
    name: string;
    quantity: number;
    measure: Measure;
}

export interface IRecipe {
    recipeName: string,
    timeInMinutes: number,
    steps: string[],
    ingredients: RecipeIngredient[],
    country: string
}