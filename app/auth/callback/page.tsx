"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const finishLogin = async () => {
      try {
        // URL lengkap yang dikirim Supabase di magic link
        const url = window.location.href;

        // WAJIB: tukar kode PKCE jadi session
        const { data, error } = await supabase.auth.exchangeCodeForSession(url);

        if (error) {
          console.error("Exchange error:", error);
          router.replace("/login");
          return;
        }

        console.log("SESSION CREATED:", data);

        // Sukses → redirect ke welcome/dashboard
        router.replace("/welcome");
      } catch (err) {
        console.error("Callback error:", err);
        router.replace("/auth/login");
      }
    };

    finishLogin();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Verifying your login...
    </div>
  );
}
