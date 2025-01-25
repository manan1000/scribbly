import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates";
import { resend } from "./Resend";
import dotenv from "dotenv";

dotenv.config();

export const sendVerificationMail = async (email: string, verificationToken:string) => {
    try {
        const recepient: string[] = [email]; 
        const response = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: recepient,
            subject: process.env.VERIFICATION_EMAIL_SUBJECT as string,
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        });

        console.log("Email sent successfully: " + response.data);
        
    } catch (error) {
        console.error("Error sending verification email" + error);
    }
}