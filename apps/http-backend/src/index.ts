import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";
import drawingRoutes from "./routes/drawings.route";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.options("*", cors());
app.use(express.json());
app.use(cookieParser());


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/drawings", drawingRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
})