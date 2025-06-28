import env from "./env.js";
import { PrismaClient } from "./generated/prisma/client.js";
import { Redis } from "ioredis";

export const redis = new Redis(env.REDIS_URL);

const db = new PrismaClient();
export default db;