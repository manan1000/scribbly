import Websocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.WEB_SOCKET_PORT || 4000;   // add port in env
const JWT_SECRET = process.env.JWT_SECRET;


const wss = new WebSocketServer({ port: Number(PORT) });


function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET as string);
        if (typeof decoded === "string") {            
            return null;
        }

        if (!decoded || !decoded.userId) {
            return null;
        }

        return decoded.userId;

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
    if(userId===null){
        ws.send("Authentication failed. Please log in again.");
        ws.close();
        return;
    }

    console.log("New client connected to the web socket server");

    ws.on("message", (message: string) => {
        console.log(`Received: ${message}`);

        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === Websocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);