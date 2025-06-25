import db from "../db.js";

export const createUser = async (name: string, email: string, password: string) => {
    const newUser = await db.user.create({
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
