"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function CallbackBody() {
  const router = useRouter();

  useEffect(() => {
    const finish = async () => {
      try {
        // URL lengkap dari magic link
        const url = window.location.href;

        // WAJIB: Tukar authorization code ---> session (cookie Supabase dibuat di sini)
        const { data, error } = await supabase.auth.exchangeCodeForSession(url);

        if (error) {
          console.error("Exchange error:", error);
          router.replace("/auth/login");
          return;
        }

        console.log("SESSION CREATED:", data);

        // Sekarang Supabase sudah punya sb-access-token & sb-refresh-token di cookie
        router.replace("/welcome");
      } catch (err) {
        console.error("Callback error:", err);
        router.replace("/auth/login");
      }
    };

    finish();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Verifying...
    </div>
  );
}
