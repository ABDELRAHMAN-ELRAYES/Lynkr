import rateLimit from "express-rate-limit";

// General API rate limiter - 100 requests per minute per IP
export const generalApiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, 
    message: {
        success: false,
        message: "Too many requests, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter rate limiter for auth endpoints - 10 requests per minute per IP
export const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, 
    message: {
        success: false,
        message: "Too many authentication attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Even stricter limiter for password reset - 5 requests per minute
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    message: {
        success: false,
        message: "Too many password reset attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
