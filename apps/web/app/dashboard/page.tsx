"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [drawings, setDrawings] = useState<{ id: number; title: string }[]>([]);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/signup");
        }
    }, [user, loading, router]);

    useEffect(() => {
        async function fetchDrawings() {
            try {
                const res = await fetch("http://localhost:5000/api/v1/drawings", { credentials: "include" });
                const data = await res.json();
                setDrawings(data);
            } catch (error) {
                console.error("Failed to load drawings", error);
            }
        }

        if (user) {
            fetchDrawings();
        }
    }, [user]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user?.username}!</h1>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
                onClick={() => router.push("/drawing/new")}
            >
                Create New Drawing
            </button>

            <div className="grid grid-cols-2 gap-4">
                {drawings.map((drawing) => (
                    <div key={drawing.id} className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold">{drawing.title}</h2>
                        <button
                            className="text-blue-500 underline"
                            onClick={() => router.push(`/drawing/${drawing.id}`)}
                        >
                            Open
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
