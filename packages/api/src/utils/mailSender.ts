import { MailTemplateOptions } from "../types/mailOptions.js";
import nodemailer from 'nodemailer';
import env from "../env.js";
import AppError from "../models/appError.js";
import { errorCodes, errors } from "../config/errors.js";
import { logger } from "./logger.js";
import { getEmailTemplate } from "./mailBuilder.js";

export const sendMail = async ({ recipient, resetPasswordUrl, verificationToken, type, userName }: MailTemplateOptions) => {
    let templateName: string;

    switch (type) {
        case "emailVerification":
            templateName = "emailVerification";
            break;
        case "resetPassword":
            templateName = "resetPassword";
            break;
        default:
            throw AppError.custom(500, errorCodes.unexpected, "Invalid Email type");
    }

    const emailVariables = new Map<string, string>([
        ["userName", userName || ""],
        ["verificationToken", verificationToken || ""],
        ["resetPasswordUrl", resetPasswordUrl || ""],
    ]);

    if (templateName === "emailVerification" && verificationToken === "") {
        throw AppError.custom(500, errorCodes.unexpected, "Verification token not found")
    }

    const emailBody = getEmailTemplate(templateName, emailVariables)

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 578,
        secure: false,
        auth: {
            user: env.EMAIL_APP_USER,
            pass: env.EMAIL_APP_PASSWORD,
        },
    })

    const mailOptions = {
        from: {
            name: "Saleh Enab",
            address: "salehenab850@gmail.com"
        },
        bcc: recipient,
        subject: type === 'emailVerification' ? "Email Verification" : "Password Reset Link",
        html: emailBody,
    }

    await transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            throw errors.unexpected;
        }
        logger.info("Email has been sent " + info.accepted)
    })
};