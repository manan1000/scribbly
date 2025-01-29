import { Request, Response, NextFunction } from "express";
import { signupData } from "@repo/types/authTypes";
import { signupValidator } from "@repo/zod/validators";
import prisma from "@repo/db/client";
import bcrypt from "bcryptjs"
import GenerateVerificationToken from "../utils/GenerateVerificationToken";
import { sendVerificationMail, sendWelcomeMail } from "../email/email";


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

        const verificationToken = await prisma.verificationToken.create({
            data: {
                userId: user.id,
                token: GenerateVerificationToken(),
                expiresAt: new Date(Date.now() + 15 * 60 * 1000)   // 15 mins
            }
        })

        //  send verification mail
        await sendVerificationMail(user.email, verificationToken.token);

        res.status(201).json({ success: true, message: "User created successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: "User signup failed." });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.body;
    try {
        const tokenFromDB = await prisma.verificationToken.findFirst({
            where: {
                token: token,
                expiresAt: {
                    gt: new Date()
                }
            }
        });

        if (!tokenFromDB) {
            res.status(404).json({ success: false, message: "Token is either invalid or expired." });
            return;
        }

        const userId = tokenFromDB.userId;

        await prisma.user.update({
            where: { id: userId },
            data: { isVerified: true }
        });
        
        await prisma.verificationToken.delete({
            where: {id: tokenFromDB.id}
        });

        // TODO: send welcome email (will have to fetch user from db)
        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        });

        if(!user){
            res.status(404).json({success: false, message: "User not found"});
            return;
        }

        await sendWelcomeMail(user.email, user.username);

        res.status(200).json({success: true, message: "User verified"});
        return;

    } catch (error) {
        res.status(400).json({success:false , message: "An error occured"});
    }
};


export const signin = async (req: Request, res: Response) => {
    const {email,password} = req.body;
    try {
        
    } catch (error) {
        
    }
};