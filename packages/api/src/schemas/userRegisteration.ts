import { z } from 'zod';
import { validate } from '../utils/validator.js';

export const userRegisterSchema = z.object({
    body: z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
        confirmPassword: z.string()
    })

}).refine((data) => data.body.password === data.body.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirm"]
})

export const signUpValidator = validate(userRegisterSchema)
export type SignUpMiddleware = typeof signUpValidator