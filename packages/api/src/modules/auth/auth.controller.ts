import { errors } from "../../config/errors.js";
import { createUser, findUserByEmail, findUserByVerificationToken, upadteResetPasswordToken, updateEmailVerificationStatus, updateEmailVerificationToken, updatePassword } from "../../services/user.service.js";
import { logger } from "../../utils/logger.js";
import { sendMail } from "../../utils/mailSender.js";
import crypto from 'crypto';
import { hashPassword, validatePassword } from "../../utils/passwordHandler.js";
import db from "../../db.js";
import { EmailVerificationMiddleware } from "../../schemas/emailVerification.js";
import { SignUpMiddleware } from "../../schemas/userRegisteration.js";
import AppError from "../../models/appError.js";
import { NewEmailTokenMiddleware } from "../../schemas/emailToken.js";
import { LoginMiddleware } from "../../schemas/userLogin.js";
import { createToken, verifyToken } from "../../utils/tokensHandlers.js";
import env from "../../env.js";
import { NextFunction, Request, Response } from "express";
import { ForgetPasswordMiddleware } from "../../schemas/forgetPasswordToken.js";
import { ResetPasswordMiddleware } from "../../schemas/resetPassword.js";
import { JwtPayload } from "jsonwebtoken";

export const signUp: SignUpMiddleware = async (req, res, next) => {
    const { name, email, password } = req.body;
    const oldCustomers = await findUserByEmail(email);
    if (oldCustomers) {
        return next(errors.userExists);
    }

    const hashedPassword = await hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    const expiryDate = new Date(Date.now() + 10 * 60 * 1000);

    const result = await db.$transaction(async (tx) => {
        const user = await createUser(tx, name, email, hashedPassword, hashedVerificationToken, expiryDate)

        await sendMail({
            recipient: user.email,
            userName: user.name,
            verificationToken: verificationToken,
            type: "emailVerification"
        })

        return user;
    })


    res.status(201).json({
        userData: result
    });

    logger.info("User has been registered successfully");
};

export const verifyEmail: EmailVerificationMiddleware = async (req, res, next) => {
    const token = req.query.token;
    if (!token) {
        next(AppError.custom(400, 998, "Verification token not provided"));
    }
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await findUserByVerificationToken(hashedToken);

    if (!user) {
        return next(errors.invalidToken);
    }
    console.log("Before update");

    await updateEmailVerificationStatus(user.id);

    res.status(200).json({ message: "Email verified successfully!" });
};

export const generateNewEmailToken: NewEmailTokenMiddleware = async (req, res, next) => {
    const userEmail = req.query.email;
    const user = await findUserByEmail(userEmail)

    if (!user) {
        return next(AppError.custom(400, 988, "User not found"));
    }

    if (user.verified) {
        return next(AppError.custom(400, 999, "Email is already verified"));
    }

    const plainToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(plainToken).digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await updateEmailVerificationToken(user.email, hashedToken, expiresAt);

    await sendMail({
        recipient: user.email,
        userName: user.name,
        verificationToken: plainToken,
        type: "emailVerification",
    });

    res.status(200).json({ message: "New verification token generated successfully!" });

};

export const login: LoginMiddleware = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user || !(await validatePassword(password, user.password))) {
        return next(errors.invalidLogin);
    }

    const accessToken = createToken(
        { id: user.id, email: user.email },
        "accessToken",
        { expiresIn: env.ACCESS_TOKEN_TTL }
    );

    const refreshToken = createToken(
        { id: user.id, email: user.email },
        "refreshToken",
        { expiresIn: env.REFRESH_TOKEN_TTL }
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true
    })

    res.json({
        validUser: true,
        accessToken: accessToken,
        refreshToken: refreshToken,
        accessTokenExpiresIn: env.ACCESS_TOKEN_TTL,
        refreshTokenExpiresIn: env.REFRESH_TOKEN_TTL
    });
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie("refreshToken", { httpOnly: true });

    res.json({
        message: "User logged out successfully"
    });
};

export const forgetPassword: ForgetPasswordMiddleware = async (req, res, next) => {
    const { email } = req.body
    const user = await findUserByEmail(email)
    if (!user) {
        return next(AppError.custom(400, 998, "User not found"));
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await upadteResetPasswordToken(email, hashedToken)

    const resetUrl = `http://localhost:3000/api/v1/auth/reset-password?token=${resetToken}&email=${email}`;
    await sendMail({
        recipient: user.email,
        resetPasswordUrl: resetUrl,
        userName: user.name,
        type: "resetPassword"
    })

    res.json({
        message: "Password reset link has been sent to your email"
    })
};

export const resetPassword: ResetPasswordMiddleware = async (req, res, next) => {
    const { passwordToken, email, newPassword } = req.body;
    if (!passwordToken || !email || !newPassword) {
        return next(AppError.custom(400, 998, "Email or Password token not provided"))
    }
    const hashedToken = crypto.createHash('sha256').update(passwordToken).digest('hex');
    const newHashedPassword = await hashPassword(newPassword);

    const updatedCustomer = await updatePassword(email, hashedToken, newHashedPassword)

    if (updatedCustomer.count === 0) {
        return next(AppError.custom(400, 998, "Invalid Email or Token"));
    }
    res.json({
        message: "Password has been updated successfully"
    })
};

export const generateNewAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    const authHeader = req.headers["authorization"]
    const accessToken = authHeader?.split(" ")[1]

    if (!accessToken) {
        return next(AppError.custom(400, 998, "Access token is not provided"));
    }
    if (!refreshToken) {
        return next(AppError.custom(400, 998, "Refresh token is not provided"));
    }

    const accessDecoded = verifyToken(accessToken, "accessToken")

    if (!accessDecoded.verified && refreshToken) {
        const refreshDecoded = verifyToken(refreshToken, "refreshToken")

        if (!refreshDecoded.verified) {
            return next(AppError.custom(403, 1015, refreshDecoded.error!));
        }

        const { id, email, role } = refreshDecoded.data as JwtPayload
        const newAccessToken = createToken({ id, email, role }, "accessToken", { expiresIn: env.ACCESS_TOKEN_TTL })
        res.setHeader("x-access-token", newAccessToken);
        req.accessToken = newAccessToken
        logger.info("New access token has been generated")

        res.status(200).json({
            message: "New access token has been generated"
        })
        return;
    }
    res.json({
        message: "Access token still valid, try to logout first."
    })
}