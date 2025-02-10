import prisma from "@repo/db/client";
import { Request, Response } from "express"

export const getDrawings = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const userDrawings = await prisma.drawing.findMany({
            where: { ownerId: Number(userId) },
            select: {
                id: true,
                title: true,
                roomName: true
            }
        });

        res.status(200).json({ success: true, drawings: userDrawings });
        return;
    } catch (error) {
        res.status(500).json({ success: false, message: "unable to fetch user drawings" });
    }
};


export const createDrawing = async (req: Request, res: Response) => {
    const { title } = req.body;
    const roomName = crypto.randomUUID();
    try {
        const drawing = await prisma.drawing.create({
            data: {
                title,
                roomName,
                ownerId: Number(req.userId)
            }
        });

        res.status(201).json({ success: true, id: drawing.id, roomName: drawing.roomName });
        return;
    } catch(error){
        res.status(500).json({ success: false, message: "unable to create drawing" });
    }
}