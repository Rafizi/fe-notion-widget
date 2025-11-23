"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const error = searchParams.get("error");
    const errorCode = searchParams.get("error_code");
    const code = searchParams.get("code");

    // 1️⃣ Kalau Supabase sudah kirim error di URL
    if (error || errorCode) {
      if (errorCode === "otp_expired") {
        setStatus("error");
        setMessage("Magic link sudah expired, coba kirim ulang bro 🔁");
        return;
      }

      setStatus("error");
      setMessage("Gagal verifikasi magic link bro ❌");
      return;
    }

    // 2️⃣ Kalau gak ada code sama sekali
    if (!code) {
      setStatus("error");
      setMessage("Kode verifikasi tidak ditemukan di URL ❌");
      return;
    }

    // 3️⃣ Exchange code → jadi session
    const run = async () => {
      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error("Exchange error:", exchangeError.message);
        if (exchangeError.message.toLowerCase().includes("expired")) {
          setStatus("error");
          setMessage("Magic link sudah expired, kirim ulang ya bro 🔁");
          return;
        }

        setStatus("error");
        setMessage("Gagal membuat sesi login ❌");
        return;
      }

      // 4️⃣ Sukses → ke dashboard
      router.replace("/dashboard");
    };

    run();
  }, [router, searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Lagi verifikasi magic link lo bro... ⏳</p>
      </div>
    );
  }

  // status === "error"
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-lg text-red-500 font-semibold">{message}</p>
      <button
        onClick={() => router.push("/login")}
        className="px-4 py-2 rounded bg-blue-600 text-white"
      >
        Balik ke halaman login
      </button>
    </div>
  );
}
