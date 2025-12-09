"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email) {
      alert("Masukin email dulu bro 😭");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // WAJIB match dengan callback page lo
        emailRedirectTo:
          "https://khalify-notion-widgets.vercel.app/auth/callback",
      },
    });

    setLoading(false);

    if (error) {
      console.error("OTP ERROR:", error);
      alert("Gagal ngirim magic link 😥");
      return;
    }

    alert("Cek email lo bro! Magic link udah dikirim 🚀");
  };

  return (
    <div className="p-10 flex flex-col gap-4 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold">Login</h1>

      <input
        type="email"
        placeholder="email lo bro..."
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded"
      >
        {loading ? "Ngirim..." : "Kirim Magic Link"}
      </button>
    </div>
  );
}
