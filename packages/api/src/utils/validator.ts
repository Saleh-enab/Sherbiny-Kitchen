import z from 'zod';
import { Request, Response, NextFunction } from 'express';


type ZodRequestSchema<B, Q, P> = z.ZodObject<{
    body?: z.ZodSchema<B>,
    query?: z.ZodSchema<Q>,
    params?: z.ZodSchema<P>
}>

export const validate = <B, Q, P>(schema: ZodRequestSchema<B, Q, P> | z.ZodEffects<ZodRequestSchema<B, Q, P>>) => {
    return (req: Request<P, object, B, Q>, res: Response, next: NextFunction) => {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params
        })

        if (!result.success) {
            const validationError = result.error
            return next(validationError);
        }

        req.body = (result.data.body ?? req.body) as B
        req.query = (result.data.query ?? req.query) as Q
        req.params = (result.data.params ?? req.params) as P

        next();
    }
}