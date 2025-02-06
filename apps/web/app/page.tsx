"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {

  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const res = await fetch("http://localhost:5000/api/v1/auth/check-auth", {
        method: "GET",
        credentials: "include"
      });

      if (res.ok) router.push("/dashboard");
      else router.push("/signup");
    }

    checkAuthentication();
  }, [router]);
  return (<></>);
}
