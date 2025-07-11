import db from "../db.js";
import { Prisma } from "../generated/prisma/client.js";

export const createUser = async (tx: Prisma.TransactionClient,
    name: string,
    email: string,
    password: string,
    verificationToken: string,
    verificationTokenExpiration: Date) => {
    const newUser = await tx.user.create({
        data: {
            name,
            email,
            password,
            verificationToken,
            verificationTokenExpiration
        }, omit: {
            password: true
        }
    })
    return newUser;
}

export const findUserByEmail = async (email: string) => {
    const user = await db.user.findUnique({
        where: {
            email: email.toLowerCase(),
        }
    });
    return user;
};

export const updateEmailVerificationStatus = async (email: string) => {
    await db.user.update({
        where: { email },
        data: {
            verified: true,
            verificationToken: null,
            verificationTokenExpiration: null

        }
    });
}

export const updateEmailVerificationToken = async (userEmail: string, newToken: string, newExipiration: Date) => {
    await db.user.update({
        where: { email: userEmail },
        data: {
            verificationToken: newToken,
            verificationTokenExpiration: newExipiration
        }
    });
}


export const findUserByVerificationToken = async (token: string) => {
    const user = await db.user.findFirst({
        where: {
            verificationToken: token,
            verificationTokenExpiration: {
                gte: new Date()
            }
        }
    });

    return user;
}

export const updateEmailAccessToken = async (userEmail: string, newToken: string, newExipiration: Date) => {
    await db.user.update({
        where: { email: userEmail },
        data: {
            verificationToken: newToken,
            verificationTokenExpiration: newExipiration
        }
    });
}

export const upadteResetPasswordToken = async (userEmail: string, resetToken: string) => {
    await db.user.update({
        where: { email: userEmail },
        data: {
            resetPasswordToken: resetToken,
            resetPasswordExpiration: new Date(Date.now() + 10 * 60 * 1000)
        }
    })
}

export const updatePassword = async (userEmail: string, passwordToken: string, newPassword: string) => {
    const updatedUser = await db.user.updateMany({
        where: {
            email: userEmail,
            resetPasswordToken: passwordToken,
            resetPasswordExpiration: { gt: new Date() },
        },
        data: {
            password: newPassword,
            resetPasswordExpiration: null,
            resetPasswordToken: null,
        },
    });
    return updatedUser;
}