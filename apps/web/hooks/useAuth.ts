import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth() {

    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/v1/auth/check-auth", {
                    method: "GET",
                    credentials: "include"
                });

                if (res.ok) setAuthenticated(true);
                else router.push("/signup");

            } catch (error) {
                router.push("/signup");
            } finally {
                setLoading(false);
            }

        }

        checkAuth();
    }, [router]);

    return { authenticated, loading };
}
