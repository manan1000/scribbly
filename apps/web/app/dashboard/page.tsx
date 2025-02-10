"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { useLogout } from "../../hooks/useLogout";


export default function Dashboard() {

    const [drawings, setDrawings] = useState<{ id: string; title: string, roomName: string }[]>([]);
    const [error,setError] = useState("");
    const { authenticated, loading } = useAuth();
    const logout = useLogout();
    const router = useRouter();
    const [username, setUsername] = useState("");

    useEffect(() => {

        const fetchUsername = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/v1/auth/get-username", {
                    method: "GET",
                    credentials: "include"
                });

                if (res.ok) {
                    const data = await res.json();
                    setUsername(data.username);
                }
            } catch (error) {
                router.push("/login");
                setError("Failed to fetch username");
            }
        }

        const fetchDrawings = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/v1/drawings/get-drawings", {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setDrawings(data.drawings);
                }
            } catch (error) {
                console.error("Failed to fetch drawings:", error);
                setError("Failed to fetch drawings");
            }
        };

        fetchUsername();
        fetchDrawings();
    }, [router]);

    const createNewDrawing = async () => {

        try{
            const res = await fetch("http://localhost:5000/api/v1/drawings/create",{
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: "untitled drawing"
                })
            });

            if(res.ok) {
                const data = await res.json();
                router.push(`/drawing/${data.roomName}/${data.id}`)
            } else{
                setError("Failed to create a new drawinf");
            }
        } catch(error){
            setError("Failed to create a new drawing");
        }
    }

    if (loading) return <p className="text-3xl text-center mt-20">Loading...</p>

    if (!authenticated) return null; // prevent rendering until redirect

    return (
        <div className="w-[1320px] mt-10 min-h-screen mx-auto " >
            <div className="flex justify-between">
                <div className="flex justify-center items-center">
                    <h2 className="text-2xl bg-gradient-to-r from-blue-600 to-red-500 text-transparent bg-clip-text">Welcome {username}!</h2>
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={createNewDrawing}

                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 text-center cursor-pointer"
                    >
                        Create new drawing
                    </button>
                    <button
                        onClick={logout}
                        className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-700 cursor-pointer text-center"
                    >
                        Logout
                    </button>
                </div>
            </div>
            
            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="mt-6 w-80">
                {drawings.length > 0 ? (
                    drawings.map((drawing) => (
                        <div
                            key={drawing.id}
                            className="flex justify-between items-center p-2 border-b"
                        >
                            <span>{drawing.title}</span>
                            <button
                                className="text-blue-500"
                                onClick={() => router.push(`/drawing/${drawing.roomName}/${drawing.id}`)}
                            >
                                Open
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No drawings yet.</p>
                )}
            </div>
        </div>
    );
}
