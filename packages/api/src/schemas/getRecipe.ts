import { z } from 'zod';
import { validate } from '../utils/validator.js';

export const getRecipeSchema = z.object({
    params: z.object({
        recipeKey: z.string()
    })
});

export const getRecipeValidator = validate(getRecipeSchema);
export type GetRecipeMiddleware = typeof getRecipeValidator;