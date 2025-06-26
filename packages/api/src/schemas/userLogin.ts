import { z } from 'zod';
import { validate } from '../utils/validator.js';

export const userLoginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    })
})

export const loginValidator = validate(userLoginSchema)
export type LoginMiddleware = typeof loginValidator