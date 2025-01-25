import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.RESEND_API_KEY);


export const resend = new Resend(process.env.RESEND_API_KEY);

