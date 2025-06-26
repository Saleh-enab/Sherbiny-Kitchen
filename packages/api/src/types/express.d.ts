import { UserPayload } from "./userPayload.ts";

export { };


declare global {
    namespace Express {
        export interface Request {
            user: UserPayload,
            accessToken: string
        }
    }
}