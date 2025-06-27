import { Measure } from "../generated/prisma/enums.js";

export interface IngredientInput {
    name: string;
    quantity: number;
    measure: Measure;
}

export interface PromptInputs {
    ingredients: IngredientInput[];
    options: string[];
    country: string;
    dishType: "MAIN" | "DESSERT" | "APPETIZER" | "SNACK";
}
