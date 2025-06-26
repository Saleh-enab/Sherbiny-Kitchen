import { errors } from "../../config/errors.js";
import { createUser, findUserByEmail, findUserByVerificationToken, updateEmailVerificationStatus, updateEmailVerificationToken } from "../../services/user.service.js";
import { logger } from "../../utils/logger.js";
import { sendMail } from "../../utils/mailSender.js";
import crypto from 'crypto';
import { hashPassword } from "../../utils/passwordHandler.js";
import db from "../../db.js";
import { EmailVerificationMiddleware } from "../../schemas/emailVerification.js";
import { SignUpMiddleware } from "../../schemas/userRegisteration.js";
import AppError from "../../models/appError.js";
import { NewEmailTokenMiddleware } from "../../schemas/emailToken.js";

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

}