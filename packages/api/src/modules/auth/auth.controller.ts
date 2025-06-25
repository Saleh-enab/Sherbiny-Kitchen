import { errors } from "../../config/errors.js";
import { SignUpMiddleware } from "../../schemas/userRegister.js";
import { createUser, findUserByEmail } from "../../services/user.service.js";
import { logger } from "../../utils/logger.js";
import { sendMail } from "../../utils/mailSender.js";
import crypto from 'crypto';
import { hashPassword } from "../../utils/passwordHandler.js";

export const signUp: SignUpMiddleware = async (req, res, next) => {
    const { name, email, password } = req.body;
    const oldCustomers = await findUserByEmail(email);
    if (oldCustomers) {
        return next(errors.userExists);
    }

    const hashedPassword = await hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    const user = await createUser(name, email, hashedPassword);

    await sendMail({
        recipient: user.email,
        userName: user.name,
        verificationToken: hashedVerificationToken,
        type: "emailVerification"
    })

    res.status(201).json({
        customerData: user
    });

    logger.info("User has been registered successfully");
};