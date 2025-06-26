import { RequestHandler } from "express"
import { errors } from "../config/errors.js"
import { verifyToken } from "../utils/tokensHandlers.js"
import AppError from "../models/appError.js"
import { UserPayload } from "../types/userPayload.js"

export const authorizeUser: RequestHandler = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1]

    if (!token) {
        return next(AppError.custom(400, 998, "Access token is not provided"));
    }
    const decoded = verifyToken(token, "accessToken")

    if (!decoded.verified) {
        return next(errors.invalidToken);
    }

    req.user = decoded.data as UserPayload
    return next();
}