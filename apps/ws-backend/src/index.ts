import Websocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "@repo/db/client";

dotenv.config();

const PORT = process.env.WEB_SOCKET_PORT || 4000;   // add port in env
const JWT_SECRET = process.env.JWT_SECRET;

const rooms: Record<string, Set<Websocket>> = {};

const wss = new WebSocketServer({ port: Number(PORT) });


function checkUser(token: string): number | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET as string);
        if (typeof decoded === "string") {
            return null;
        }

        return Number(decoded.userId) || null;

    } catch (error) {
        return null;
    }
}


async function loadRooms() {
    const activeRooms = await prisma.room.findMany();

    activeRooms.forEach((room) => {
        rooms[room.roomName] = new Set();
    });

    console.log(`Loaded active rooms `, Object.keys(rooms));
}



async function joinRoom(userId: number, roomName: string, ws: Websocket) {
    let room = await prisma.room.findUnique({
        where: { roomName }
    });

    let drawing = await prisma.drawing.findUnique({
        where: { roomName },
        include: { elements: true }
    });

    if (!room) {
        room = await prisma.room.create({
            data: { roomName }
        });
    }

    if (!drawing) {
        drawing = await prisma.drawing.create({
            data: {
                title: `${roomName} drawing`,
                roomName,
                ownerId: userId
            },
            include: { elements: true }
        });
    }

    await prisma.userRoom.upsert({
        where: {
            userId_roomId: {
                userId,
                roomId: room.id
            }
        },
        update: {},
        create: {
            userId,
            roomId: room.id
        }
    });

    if (!rooms[roomName]) {
        rooms[roomName] = new Set();
    }

    rooms[roomName].add(ws);
    if (drawing.elements.length > 0) {
        ws.send(JSON.stringify({
            type: "drawing:load",
            elements: drawing.elements
        }));
    }

    ws.send(JSON.stringify({ message: `Joined room: ${roomName}` }));
    console.log(`User ${userId} joined room ${roomName}`);
}

async function leaveRoom(userId: number, roomName: string, ws: Websocket) {
    rooms[roomName]?.delete(ws);

    await prisma.userRoom.deleteMany({
        where: {
            userId,
            room: { roomName }
        }
    });

    if (rooms[roomName]?.size === 0) {
        delete rooms[roomName];

        await prisma.room.deleteMany({
            where: { roomName }
        });
    }

    console.log(`User: ${userId} left room: ${roomName}`);

}



wss.on("connection", (ws, request) => {
    const url = request.url;
    if (!url) {
        ws.close();
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get("token") || "";
    const userId = checkUser(token);


    if (!userId) {
        ws.send("Authentication failed. Please signin.");
        ws.close();
        return;
    }

    let currentRoom: string | null = null;
    console.log(`User: ${userId} connected`);

    ws.on("message", async (message: string) => {

        try {
            const parsedData = JSON.parse(message);

            if (parsedData.type === "join_room") {
                const roomName = parsedData.roomName;

                if (!roomName) {
                    ws.send(JSON.stringify({ error: "roomName is required" }));
                    return;
                }
                await joinRoom(userId, roomName, ws);
                currentRoom = roomName;
            }

            if (parsedData.type === "drawing:update") {
                if (!currentRoom) {
                    ws.send(JSON.stringify({ error: "You are not in a room." }));
                    return;
                }

                console.log(parsedData);


                const { id, type, x, y, width, height, content, strokeColor, points, drawingId } = parsedData.element;

                await prisma.element.upsert({
                    where: { id: id || -1 },
                    update: { x, y, width, height, content, strokeColor, points },
                    create: { type, x, y, width, height, content, strokeColor, points, drawingId }
                });





                rooms[currentRoom]?.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: "drawing:update",
                            roomName: parsedData.roomName,
                            userId: userId,
                            element: parsedData.element
                        }));
                    }
                });
            }

            if (parsedData.type === "leave_room") {
                if (currentRoom) {
                    await leaveRoom(userId, currentRoom, ws);
                    currentRoom = null;
                }
            }


        } catch (error) {
            console.log(error);

            ws.send(JSON.stringify({ error: "Invalid JSON format" }));
        }

    });

    ws.on("close", async () => {
        if (currentRoom) {
            await leaveRoom(userId, currentRoom, ws);
            currentRoom = null;
        }
    });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
loadRooms();    // load active rooms

