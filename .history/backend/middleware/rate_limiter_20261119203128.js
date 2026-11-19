// const rateLimit = require("express-rate-limit");

// // Global limiter — applies to all routes
// const globalLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     limit: 100,               // max 100 requests per IP per window
//     standardHeaders: "draft-8", // RateLimit-* headers
//     legacyHeaders: false,
//     message: { error: "Too many requests, please try again later." },
// });

// // Stricter limiter for auth routes (brute-force protection)
// const authLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     limit: 5,                 // only 5 login/signup attempts per 15 min
//     standardHeaders: "draft-8",
//     legacyHeaders: false,
//     message: { error: "Too many attempts, try again in 15 minutes." },
// });

// module.exports = { globalLimiter, authLimiter };