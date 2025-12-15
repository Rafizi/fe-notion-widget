"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthEmbedClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = localStorage.getItem("login_email");

    if (!token || !email) {
      router.replace("/auth/login");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          "https://khalify-be.vercel.app/auth/verify-token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ token, email }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Token invalid");
        }

        // bersihin email setelah sukses
        localStorage.removeItem("login_email");

        router.replace("/welcome");
      } catch (err) {
        router.replace("/auth/login");
      }
    };

    verify();
  }, [router, searchParams]);

  return null;
}
