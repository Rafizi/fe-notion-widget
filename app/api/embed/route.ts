/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: Request) {
  const { token, db } = await req.json();

  if (!token || !db) {
    return NextResponse.json({ error: "Missing token/db" }, { status: 400 });
  }

  // Generate 6-char widget ID
  const id = randomUUID().slice(0, 6);

  // Ambil USER ID dari user yang login
  const supabase = createServerComponentClient({ cookies });
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth?.user?.id ?? null;

  const { error } = await supabaseAdmin.from("widgets").insert({
    id,
    token,
    db,
    user_id: userId,
    created_at: Date.now(),
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to store widget" }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const embedUrl = `${baseUrl}/embed/${id}?db=${db}`;

  return NextResponse.json({ success: true, embedUrl });
}


// GET TOKEN (unchanged)
export async function getToken(id: string) {
  const { data, error } = await supabaseAdmin
    .from("widgets")
    .select("token")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data.token;
}
