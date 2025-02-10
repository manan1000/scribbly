"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function DrawingPage() {

    const { roomName, id } = useParams();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {

        const connectWebSocket = async () => {
            try {

                const res = await fetch("http://localhost:5000/api/v1/auth/get-token", {
                    method: "GET",
                    credentials: "include"
                });


                if (!res.ok) throw new Error("Failed to get token");

                const { token } = await res.json();

                const wsUrl = `ws://localhost:4000?token=${token}`;
                const ws = new WebSocket(wsUrl);

                ws.onopen = () => console.log("Connected to ws server");
                ws.onmessage = (event) => console.log(event.data);
                ws.onerror = (error) => console.error("Webws Error:", error);
                ws.onclose = () => console.log("WebSocket disconnected.");

                setSocket(ws);
                return () => ws.close();

            } catch (error) {
                console.error("WS connection failed"), error;
            }
        }

        connectWebSocket();


    }, []);



    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Drawing room: {roomName}</h1>
            <canvas ref={canvasRef} className="border border-gray-400" width={800} height={500} />
        </div>
    );
}