import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth",authRoutes);

app.listen(PORT,()=>{
    console.log("Server is running on port: "+PORT);
})