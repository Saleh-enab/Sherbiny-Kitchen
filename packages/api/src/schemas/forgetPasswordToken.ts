import { z } from 'zod';
import { validate } from '../utils/validator.js';

export const forgetPasswordSchema = z.object({
    body: z.object({
        email: z.string().email()
    })
})

export const forgetPasswordValidator = validate(forgetPasswordSchema)
export type ForgetPasswordMiddleware = typeof forgetPasswordValidator