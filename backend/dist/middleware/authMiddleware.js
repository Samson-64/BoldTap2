"use strict";
// JWT authentication middleware for Express.js
// This middleware checks for a valid JWT token in the Authorization header
// If the token is valid, it attaches the decoded user information to the request object
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const env_1 = require("../config/env");
const db_1 = require("../config/db");
const errors_1 = require("../utils/errors");
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new errors_1.AuthenticationError("No authorization header provided");
        }
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            throw new errors_1.AuthenticationError("Invalid authorization header format");
        }
        const token = parts[1];
        // Verify token with explicit algorithm
        const { default: jwt } = await Promise.resolve().then(() => __importStar(require("jsonwebtoken")));
        const decoded = jwt.verify(token, env_1.JWT_SECRET, {
            algorithms: [env_1.JWT_ALGORITHM],
        });
        // Verify user exists in database
        const user = await db_1.db.users.findById(decoded.userId);
        if (!user) {
            throw new errors_1.AuthenticationError("User not found");
        }
        // Attach user info to request
        req.user = {
            id: user.id,
            userId: user.id,
            email: user.email,
        };
        next();
    }
    catch (error) {
        const err = error;
        if (err.name === "JsonWebTokenError") {
            res.status(401).json({
                success: false,
                error: "Invalid token",
                message: err.message,
            });
            return;
        }
        if (err.name === "TokenExpiredError") {
            res.status(401).json({
                success: false,
                error: "Token expired",
                message: "Your session has expired. Please login again.",
            });
            return;
        }
        if (error instanceof errors_1.AuthenticationError) {
            res.status(error.statusCode).json({
                success: false,
                error: error.message,
                message: error.message,
            });
            return;
        }
        res.status(401).json({
            success: false,
            error: "Authentication failed",
            message: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
// Optional: Verify user is admin or has certain role
function authorize(..._roles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: "No user information",
            });
            return;
        }
        // TODO: Implement role checking when user roles are added to schema
        next();
    };
}
//# sourceMappingURL=authMiddleware.js.map