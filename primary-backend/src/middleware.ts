import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization as string;

  try {
    const payload = jwt.verify(token, JWT_PASSWORD) as { id: string };
    // @ts-ignore or use proper type augmentation
    req.id = payload.id;
    next();
  } catch (e) {
    res.status(403).json({
      message: "You are not logged in",
    });
    // ✅ just return, don't return `res.status(...)`
    return;
  }
}
