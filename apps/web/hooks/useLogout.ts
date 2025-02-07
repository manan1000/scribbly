"use client";

import { useRouter } from "next/navigation";

export function useLogout() {
    const router = useRouter();
    const logout = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/v1/auth/logout", {
                method: "GET",
                credentials: "include"
            });

            if (res.ok) router.push("/signin");

        } catch(error){
            console.error("Failed to logout", error);
        }
    }
    return logout;
}