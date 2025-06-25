import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

class AppError extends Error {
    public readonly statusCode: number;
    public readonly errorCode: number;

    constructor(statusCode: number, errorCode: number, message: string) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.statusCode = statusCode;
        this.errorCode = errorCode

        Error.captureStackTrace(this);
    }

    static custom(statusCode: number, errorCode: number, message: string) {
        return new AppError(statusCode, errorCode, message);
    }

    static from(err: unknown) {
        if (err instanceof AppError) return err;
        if (err instanceof ZodError) {
            return this.fromZod(err);
        }
        if (err instanceof Error) {
            return this.fromError(err);
        }
        return this.fromError(new Error('Internal server error'));
    }

    static fromError(err: Error, statusCode: number = 500) {
        return new AppError(statusCode, 500, err.message)
    }

    static fromZod(err: ZodError, statusCode: number = 400) {
        const message = fromZodError(err).message;
        return new AppError(statusCode, 400, message)  //TODO => Change 400 to suitable error code
    }
}

export default AppError;