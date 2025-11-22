"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`
      }
    });
    

    if (error) {
      alert("Gagal ngirim email bro");
      return;
    }

    alert("Cek email lo bro! Magic link sudah dikirim 🚀");
  };

  return (
    <div>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="email lo bro..."
        className="border p-2"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Kirim Magic Link
      </button>
    </div>
  );
}
