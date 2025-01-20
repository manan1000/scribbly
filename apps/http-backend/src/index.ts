import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { middleware } from "./middleware";

const app = express();

app.post("/signup", function(req,res){
    

});

app.post("/signin", function(req,res){
    const username="manan";
    const password="manan";

    const userId = 1;

    const token = jwt.sign({userId},JWT_SECRET);
    res.json({token});

});


app.post("/room", middleware , function(req,res){
    
    res.json({roomId:})
});

app.listen(5000);