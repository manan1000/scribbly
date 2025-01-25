import { Request, Response, NextFunction } from "express";
import { signupData } from "@repo/types/authTypes";
import { signupValidator } from "@repo/zod/validators";
import prisma from "@repo/db/client";
import bcrypt from "bcryptjs"
import GenerateVerificationToken from "../utils/GenerateVerificationToken";


export const signup = async (req: Request, res: Response) => {
    const { email, username, password }: signupData = req.body;
    try {

        const validatedData = signupValidator.safeParse({ email, username, password });
        if (!validatedData.success) {
            res.status(400).json({ success: false, message: validatedData.error });
            return;
        }

        const userAlreadyExists = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (userAlreadyExists) {
            res.status(409).json({ success: false, message: "User with same email/username already exists." });
            return;
        }

        const hashedPassword = await bcrypt.hash(validatedData.data.password, 12);

        const user = await prisma.user.create({
            data: {
                email: validatedData.data.email,
                username: validatedData.data.username,
                password: hashedPassword
            }
        });

        // save verification token to db

        await prisma.verificationToken.create({
            data: {
                userId: user.id,
                token: GenerateVerificationToken(),
                expiresAt: new Date(Date.now() + 15 * 60 * 1000)   // 15 mins
            }
        })

        // TODO: send verification mail

        res.status(201).json({ success: true, message: "User created successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: "User signup failed." });
    }
}