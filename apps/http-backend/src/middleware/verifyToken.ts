import { NextFunction, Request, Response } from "express";
import jwt, { decode, JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    try {
        if (!token) {
            res.status(401).json({ success: false, message: "Unauthenticated" });
            return;
        }

        const decodedValue = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        if (!decodedValue) {
            res.status(401).json({ success: false, message: "Unauthenticated" });
        }

        req.userId = decodedValue.userId;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Unauthenticated" });
    }
}