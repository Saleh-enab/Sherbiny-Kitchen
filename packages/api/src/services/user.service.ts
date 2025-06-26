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
            email
        }
    })
    return user;
}

export const updateEmailVerificationStatus = async (userId: number) => {
    await db.user.update({
        where: { id: userId },
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