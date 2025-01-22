import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";

const app = express();

app.post("/signup", function (req, res) {


});

app.post("/signin", function (req, res) {
    const username = "manan";
    const password = "manan";   
    const name = "manan";   

    const data = CreateUserSchema.safeParse(req.body);
    const userId = 1;

    const token = jwt.sign({ userId }, JWT_SECRET);
    res.json({ token });

});


app.post("/room", middleware, function (req, res) {

    res.json({ roomId: "1234"})
});

app.listen(5000);