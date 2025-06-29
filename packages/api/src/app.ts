import express, { NextFunction, type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from 'express-rate-limit';
import { errorHandler } from "./utils/errorHandler.js";
import { errors } from "./config/errors.js";
import { authRouter } from "./modules/auth/auth.route.js";
import cookieParser from 'cookie-parser';
import { recipeRouter } from "./modules/recipe/recipe.route.js";
import { ingredientRouter } from "./modules/ingredient/ingredient.route.js";

export const createServer = (): Express => {
    const app = express();

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
    })

    const setUpExpressApp = () => {
        app
            .disable("x-powered-by")
            .use(morgan("dev"))
            .use(express.urlencoded({ extended: true }))
            .use(express.json())
            .use(cors())
            .use(helmet())
            .use(limiter)
            .use(cookieParser());


        setUpRoutes();
        setupErrorHandlers();
        errorHandler.listenToErrorEvents();
    }


    const setUpRoutes = () => {
        app.get("/status", (_, res) => {
            res.json({ ok: true });
        });

        app.use('/api/v1/auth', authRouter);
        app.use('/api/v1/recipe', recipeRouter);
        app.use('/api/v1/ingredient', ingredientRouter);
    }

    const setupErrorHandlers = () => {
        app.use((req, res, next) => {
            next(errors.notFound);
        });

        app.use(async (error: unknown, req: express.Request, res: express.Response, next: NextFunction) => {
            try {
                if (res.headersSent) {
                    next();
                }
                const handledError = await errorHandler.handleError(error);
                res.status(handledError.statusCode).json({
                    errorCode: handledError.errorCode,
                    error: handledError.message,
                });
            } catch (err) {
                res.status(500).json({
                    errorCode: 1999,
                    error: err
                });
            }
        });
    };

    setUpExpressApp();
    return app;
};
