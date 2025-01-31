import Websocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.WEB_SOCKET_PORT || 4000;   // add port in env
const JWT_SECRET = process.env.JWT_SECRET;

const rooms: Record<string, Set<Websocket>> = {};

const wss = new WebSocketServer({ port: Number(PORT) });


function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET as string);
        if (typeof decoded === "string") {
            return null;
        }

        return decoded.userId || null;

    } catch (error) {
        return null;
    }
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
        ws.send("Authentication failed. Please log in again.");
        ws.close();
        return;
    }

    let currentRoom: string | null = null;
    console.log(`User: ${userId} connected`);

    ws.on("message", (message: string) => {

        try {
            const parsedData = JSON.parse(message);

            if (parsedData.type === "join_room") {
                const roomId = parsedData.roomId;

                if (!roomId) {
                    ws.send(JSON.stringify({ error: "roomId is required" }));
                    return;
                }

                if (currentRoom) {
                    rooms[currentRoom]?.delete(ws);
                }

                if (!rooms[roomId]) {
                    rooms[roomId] = new Set();
                }

                rooms[roomId]?.add(ws);   //add current user websocket to room -> set
                currentRoom = roomId;   
                ws.send(JSON.stringify({message: `Joined room ${currentRoom}`}));

                console.log(`User: ${userId} joined room: ${roomId}`);
            }

            if (parsedData.type === "chat") {
                if (!currentRoom) {
                    ws.send(JSON.stringify({ error: "You are not in a room." }));
                    return;
                }
                console.log(`Message in ${currentRoom}: ${parsedData.content}`);

                rooms[currentRoom]?.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            userId: userId,
                            content: parsedData.content
                        }));
                    }
                });
            }

            if(parsedData.type === "leave_room"){
                if(currentRoom){
                    rooms[currentRoom]?.delete(ws);

                    ws.send(JSON.stringify({ message: `You left ${currentRoom}` }));
                    console.log(`User: ${userId} left room: ${currentRoom}`);
                    

                    if(rooms[currentRoom]?.size === 0){
                        delete rooms[currentRoom];
                    }
                }
            }


        } catch (error) {
            ws.send(JSON.stringify({ error: "Invalid JSON format" }));
        }

    });

    ws.on("close", ()=>{
        if(currentRoom){
            rooms[currentRoom]?.delete(ws);

            console.log(`User: ${userId} left room: ${currentRoom}`);

            if(rooms[currentRoom]?.size === 0){
                delete rooms[currentRoom];
            }
        }
        
    });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);