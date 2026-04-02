"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RATE_LIMIT_AUTH_MAX_REQUESTS = exports.RATE_LIMIT_MAX_REQUESTS = exports.RATE_LIMIT_WINDOW_MS = exports.DATABASE_TYPE = exports.DATABASE_URL = exports.BACKEND_URL = exports.FRONTEND_URL = exports.JWT_ALGORITHM = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = exports.NODE_ENV = exports.PORT = void 0;
// Environment Variables Configuration
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
exports.PORT = parseInt(process.env.PORT || "3001", 10);
exports.NODE_ENV = process.env.NODE_ENV || "development";
// Generate a secure default for development only
const getDefaultJwtSecret = () => {
    if (exports.NODE_ENV === "production") {
        return "";
    }
    // Generate a cryptographically secure random string for dev
    return crypto_1.default.randomBytes(64).toString("hex");
};
exports.JWT_SECRET = process.env.JWT_SECRET || getDefaultJwtSecret();
if (!exports.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required. Set it in your .env file or generate one: openssl rand -hex 64");
}
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
// Security: Use stronger JWT algorithm
exports.JWT_ALGORITHM = "HS256";
exports.FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
exports.BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";
// Database configuration
exports.DATABASE_URL = process.env.DATABASE_URL || "sqlite:./dev.db";
exports.DATABASE_TYPE = process.env.DATABASE_TYPE || "in-memory";
// Rate limiting configuration
exports.RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", // 15 minutes
10);
exports.RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10);
exports.RATE_LIMIT_AUTH_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_AUTH_MAX_REQUESTS || "5", 10);
// Validation
if (exports.NODE_ENV === "production" && !process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required in production mode. Generate one: openssl rand -hex 64");
}
//# sourceMappingURL=env.js.map