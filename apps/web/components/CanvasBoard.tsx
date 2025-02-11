"use client";

import { useEffect, useState } from "react";
import { Stage, Layer, Line } from "react-konva";


export default function CanvasBoard({ socket,drawingId, roomName }: { socket: WebSocket | null, drawingId: string | null ,roomName: string | null }) {

    const [lines, setLines] = useState<any[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);

    const handleMouseDown = (e: any) => {
        setIsDrawing(true);
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { points: [pos.x, pos.y], strokeColor: "black" }]);
    };

    const handleMouseMove = (e: any) => {
        if (!isDrawing) return;
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        const lastLine = lines[lines.length - 1];
        lastLine.points = [...lastLine.points, point.x, point.y];
        setLines([...lines.slice(0, -1), lastLine]);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        if (!socket || lines.length === 0) return;
        const lastLine = lines[lines.length -1];

        const drawingUpdate = {
            type: "drawing:update",
            roomName,
            element:{
                id: Math.floor(Math.random() * 100000),
                type: "line",
                x: 0,
                y: 0,
                width: null,
                height: null,
                points: lastLine.points,
                strokeColor: lastLine.strokeColor,
                drawingId: Number(drawingId)
            }
        }

        socket.send(JSON.stringify(drawingUpdate));
    };


    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "drawing:update" && data.roomName === roomName) {
                setLines((prevLines) => [...prevLines, data.element]);
            }
        }
    }, [socket]);

    return (
        <Stage
            width={1000}
            height={600}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="border border-gray-400 bg-white"
        >
            <Layer>
                {lines.map((line, i) => (
                    <Line key={i} points={line.points} stroke={line.strokeColor} strokeWidth={2} />
                ))}
            </Layer>
        </Stage>
    );
}
