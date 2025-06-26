import db from "../db.js";
import { Prisma } from "../generated/prisma/client.js";

export const createUser = async (tx: Prisma.TransactionClient, name: string, email: string, password: string) => {
    const newUser = await tx.user.create({
        data: {
            name,
            email,
            password
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
