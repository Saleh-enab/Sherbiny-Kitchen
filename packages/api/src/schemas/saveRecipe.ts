import { z } from 'zod';
import { validate } from '../utils/validator.js';

export const saveRecipeSchema = z.object({
    params: z.object({
        recipeKey: z.string()
    })
});

export const saveRecipeValidator = validate(saveRecipeSchema);
export type SaveRecipeMiddleware = typeof saveRecipeValidator;
