"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.JWT_PASSWORD);
        // @ts-ignore or use proper type augmentation
        req.id = payload.id;
        next();
    }
    catch (e) {
        res.status(403).json({
            message: "You are not logged in",
        });
        // ✅ just return, don't return `res.status(...)`
        return;
    }
}
exports.authMiddleware = authMiddleware;
