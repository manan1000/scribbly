import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
const app = express();

app.use(express.json());

app.post("/signup", async function (req, res) {
    const password = req.body.password;
    const name = req.body.name;
    const email = req.body.email;

    // const data = CreateUserSchema.safeParse(req.body);
    const userId = 1;

    try {
        const user = await prismaClient.user.create({
            data: {
                email: email,
                password: password,
                name: name
            }
        })

        res.json({ userId: user.id });
    } catch (e) {
        res.status(411).json({
            message: "User already exists"
        })
    }

});

app.post("/signin", async function (req, res) {
    
    const username = "manan";
    const password = "manan";
    const name = "manan";
    const email = "manan@example.com";

    const data = CreateUserSchema.safeParse(req.body);
    const userId = 1;

    const token = jwt.sign({ userId }, JWT_SECRET);
    res.json({ token });


});


app.post("/room", middleware, function (req, res) {

    res.json({ roomId: "1234" })
});

app.listen(5000);