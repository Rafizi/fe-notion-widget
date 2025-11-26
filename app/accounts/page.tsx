/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import Navbar from "../components/Navbar";

export default function AccountsPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/login");
        return;
      }
      setUser(data.user);
    };

    loadUser();
  }, []);

  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10">
      <Navbar />
      <h1 className="text-2xl font-bold">Your Account</h1>
      <p className="mt-3 text-gray-700">Email: {user.email}</p>

      {/* <button
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
        onClick={async () => {
          await supabase.auth.signOut();
          router.replace("/login");
        }}
      >
        Logout
      </button> */}
      
    </div>
  );
}
