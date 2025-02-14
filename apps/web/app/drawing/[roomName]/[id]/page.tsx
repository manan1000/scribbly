"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
const CanvasBoard = dynamic(() => import("../../../../components/CanvasBoard"), {
    ssr: false,
});




export default function DrawingPage() {

    const { roomName, id } = useParams();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<HTMLCanvasElement | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const isDrawing = useRef(false);
    const [title, setTitle] = useState("Untitled Drawing");
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);


    useEffect(() => {
        const fetchTitle = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/v1/drawings/${id}`,{
                    method: "GET",
                    credentials: "include"
                });
                if (!res.ok) throw new Error("Failed to fetch drawing title");

                const data = await res.json();
                const title = data.drawing.title;
                setTitle(title);
            } catch (error) {
                console.error("Error fetching title:", error);
            }
        };

        if (id) fetchTitle();
    }, [id]);

    // Enable editing mode
    const handleTitleClick = () => {
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    // Handle title changes
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    // Save title on blur or enter key
    const saveTitleToDB = async () => {
        if (!id) return;

        try {
            const res = await fetch(`http://localhost:5000/api/v1/drawings/update-title`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, drawingId: id }),
            });

            if (!res.ok) throw new Error("Failed to update title");

            console.log("Title updated successfully");
        } catch (error) {
            console.error("Error updating title:", error);
        }
    };

    const handleTitleBlur = () => {
        setIsEditing(false);
        saveTitleToDB();
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setIsEditing(false);
            saveTitleToDB();
        }
    };

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

                ws.onopen = () => {
                    console.log("Connected to ws server");
                    ws.send(JSON.stringify({
                        type: "join_room",
                        roomName: roomName
                    }));
                };
                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    console.log("Received ws message", data);
                }
                ws.onerror = (error) => console.error("Webws Error:", error);
                ws.onclose = () => console.log("WebSocket disconnected.");

                setSocket(ws);

            } catch (error) {
                console.error("WS connection failed", error);
            }
        }

        connectWebSocket();

        return () => socket?.close();

    }, []);



    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
            {/* Editable Title */}
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleTitleKeyDown}
                    className="text-2xl font-medium mb-1 p-1 border border-gray-400 rounded"
                />
            ) : (
                <h1
                    className="text-2xl font-medium mb-1 cursor-pointer"
                    onClick={handleTitleClick}
                >
                    {title}
                </h1>
            )}
            <h1 className="text-lg  mb-4">Drawing room: {roomName}</h1>
            <CanvasBoard socket={socket} drawingId={typeof id === 'string' ? id : null} roomName={typeof roomName === 'string' ? roomName : null} />
        </div>
    );
}