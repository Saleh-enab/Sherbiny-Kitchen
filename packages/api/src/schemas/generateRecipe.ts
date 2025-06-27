import { z } from 'zod';
import { validate } from '../utils/validator.js';

const measureEnum = z.enum(["PIECE", "PACKET", "GRAM", "KILOGRAM", "SPOON", "CUP"]);

export const generateRecipeSchema = z.object({
    body: z.object({
        ingredients: z.array(z.object({
            name: z.string(),
            quantity: z.number().positive(),
            measure: measureEnum,
        })),
        options: z.array(z.string()),
        country: z.string(),
        dishType: z.enum(["MAIN", "DESSERT", "APPETIZER", "SNACK"]),
    })
});

export const generateRecipeValidator = validate(generateRecipeSchema);
export type GenerateRecipeMiddleware = typeof generateRecipeValidator;
