/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { token, db, accessToken } = await req.json();

    if (!token || !db) {
      return NextResponse.json({ error: "Missing token/db" }, { status: 400 });
    }

    console.log("ACCESS TOKEN SERVER:", accessToken);

    let userId = null;

    // 🔥 Decode token langsung ke Supabase Auth server
    if (accessToken) {
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const user = await userRes.json();
      console.log("USER FROM SUPABASE AUTH API:", user);

      userId = user?.id ?? null;
    }

    const id = randomUUID().slice(0, 6);

    // Insert ke DB
    const { error } = await supabaseAdmin.from("widgets").insert({
      id,
      db,
      token,
      user_id: userId,
      created_at: Date.now(),
    });

    if (error) {
      console.error("INSERT ERROR:", error);
      return NextResponse.json(
        {
          error: "Failed to store widget",
          detail: error.message,
          full: error,
        },
        { status: 500 }
      );
    }

    const embedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/embed/${id}?db=${db}`;

    return NextResponse.json({ success: true, embedUrl });
  } catch (err: any) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json(
      { error: "Server error", detail: err.message },
      { status: 500 }
    );
  }
}

export async function getToken(id: string) {
  const { data } = await supabaseAdmin
    .from("widgets")
    .select("token")
    .eq("id", id)
    .maybeSingle();

  return data?.token ?? null;
}
