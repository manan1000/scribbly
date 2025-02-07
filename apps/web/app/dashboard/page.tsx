"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { useLogout } from "../../hooks/useLogout";
import { DrawingCard } from "../components/DrawingCard";


export default function Dashboard() {
    const drawings = [
        { id: 1, title: "Landscape Drawing" },
        { id: 2, title: "Portrait Sketch" },
        { id: 3, title: "Abstract Art" },
        { id: 4, title: "Still Life Study" }
    ];
    const { authenticated, loading } = useAuth();
    const logout = useLogout();
    const router = useRouter();

    if (loading) return <p className="text-3xl text-center mt-20">Loading...</p>

    if (!authenticated) return null; // prevent rendering until redirect

    return (
        <div className="w-[1320px] mt-10 min-h-screen mx-auto " >
            <div className="flex justify-between">
                <div className="flex justify-center items-center">
                    <h2 className="text-2xl bg-gradient-to-r from-blue-600 to-red-500 text-transparent bg-clip-text">Welcome username!</h2>
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => {
                            console.log("create new drawing");
                        }}

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
                        onClick={() => router.push(`/drawing/${drawing.id}`)}
                        >
                        Open
                        </button>
                    </div>
                    ))
                ) : (
                    <p className="text-gray-500">No drawings yet.</p>
                )}
            </div>

            {/* <div className="mt-20 flex flex-col">
                {drawings.length > 0 ? (
                    drawings.map((drawing) => (
                        <DrawingCard key={drawing.id} title={drawing.title} />
                    ))
                ): (
                    <div className="flex flex-col justify-center items-center space-y-6 ">
                        <p className="text-center text-2xl">No drawings yet !</p>
                        <button
                            onClick={() => {
                                console.log("create new drawing");
                            }}

                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 text-center cursor-pointer w-fit"
                        >
                        Create new drawing
                    </button>
                    </div>
                ) }
            </div> */}

        </div>
    );
}
