import env from "../env.js";
import jwt, { JwtPayload } from 'jsonwebtoken';


export const createToken = (data: object, type: "accessToken" | "refreshToken", options?: jwt.SignOptions | undefined): string => {
    if (type === "accessToken") {
        var key = env.ACCESS_TOKEN_PRIVATE_KEY
    } else {
        key = env.REFRESH_TOKEN_PRIVATE_KEY
    }
    const accessToken = jwt.sign(data, key, {
        ...options,
        algorithm: 'RS256',
    })
    return accessToken;
}


export const verifyToken = (token: string, type: "accessToken" | "refreshToken"): { verified: boolean, data: string | JwtPayload } => {
    if (type === "accessToken") {
        var key = env.ACCESS_TOKEN_PUBLIC_KEY
    } else {
        key = env.REFRESH_TOKEN_PUBLIC_KEY
    }
    const decoded = jwt.verify(token, key)
    return {
        verified: true,
        data: decoded
    }
}