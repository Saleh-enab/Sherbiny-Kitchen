import { z } from 'zod';
import { validate } from '../utils/validator.js';

export const verificationSchema = z.object({
    query: z.object({
        token: z.string()
    })

})

export const emailVerificationValidator = validate(verificationSchema)
export type EmailVerificationMiddleware = typeof emailVerificationValidator