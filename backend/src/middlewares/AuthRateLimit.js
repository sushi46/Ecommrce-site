import rateLimit from "express-rate-limit";

const AuthRateLimit = rateLimit(
    {
        limit: 5,
        windowMs: 15 * 60 * 60,
        message: {
            success: "false",
            message: "Too many authentication attempts for this IP, Please try after sometime."
        }
    }
);
const globalRateLimit = rateLimit(
    {
        limit: 1000,
        windowMs: 60 * 60 * 1000,
        message: {
            success: "false",
            message: "Too many requests from this IP, please try after an hour."
        }
    }
);
const registerRateLimiter = rateLimit(
    {
        limit: 15,
        windowMs: 30 * 60 * 60,
        message: {
            success: false,
            message: "Too many registration attemts for this IP, try again after sometime."
        }
    }
);
export { AuthRateLimit, globalRateLimit, registerRateLimiter };
