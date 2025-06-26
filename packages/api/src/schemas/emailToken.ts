import { z } from 'zod';
import { validate } from '../utils/validator.js';

export const newEmailTokenSchema = z.object({
    query: z.object({
        email: z.string().email()
    })

})

export const newEmailTokenValidator = validate(newEmailTokenSchema)
export type NewEmailTokenMiddleware = typeof newEmailTokenValidator