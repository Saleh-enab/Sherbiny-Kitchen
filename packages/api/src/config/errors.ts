import AppError from "../models/appError.js";

export const errorCodes = {
    validation: 997,
    notFound: 998,
    notAllowed: 999,
    unexpected: 1999,
    invalidLogin: 1000, // Wrong email or password
    invalidAuth: 1001, // Invalid jwt token
    userExists: 1002, // Already exists username or email
    invalidEmail: 1012,
    invalidToken: 1015,
    invalidCaptcha: 1016,
    incorrectOtp: 1017,
    maxAttemptsReached: 1018,
    invalidSession: 1019,
} as const;

export const errors = {
    notAllowed: AppError.custom(403, errorCodes.notAllowed, 'Not allowed'),
    notFound: AppError.custom(404, errorCodes.notFound, 'Not found'),
    unexpected: AppError.custom(500, errorCodes.unexpected, 'Something went wrong'),
    invalidLogin: AppError.custom(401, errorCodes.invalidLogin, 'Invalid email, phone number or password.'),
    invalidAuth: AppError.custom(401, errorCodes.invalidAuth, 'Invalid token.'),
    userExists: AppError.custom(403, errorCodes.userExists, 'Email or phone number already used.'),
    invalidToken: AppError.custom(400, errorCodes.invalidToken, 'Invalid or expired token.'),
    invalidCaptcha: AppError.custom(400, errorCodes.invalidCaptcha, 'Invalid captcha.'),
    invalidSession: AppError.custom(401, errorCodes.invalidSession, 'The session is invalid or has expired.'),
    maxAttemptsReached: AppError.custom(403, errorCodes.maxAttemptsReached, 'You have reached the maximum number of attempts. Please try again later.')
} as const;
