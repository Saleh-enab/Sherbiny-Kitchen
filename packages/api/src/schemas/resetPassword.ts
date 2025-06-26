import { z } from 'zod';
import { validate } from '../utils/validator.js';

export const resetPasswordSchema = z.object({
    body: z.object({
        email: z.string().email(),
        passwordToken: z.string(),
        newPassword: z.string()
    })
})

export const resetPasswordValidator = validate(resetPasswordSchema)
export type ResetPasswordMiddleware = typeof resetPasswordValidator