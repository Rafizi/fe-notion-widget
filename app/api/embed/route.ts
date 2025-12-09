export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: Request) {
  try {
    const { token, db } = await req.json();

    if (!token || !db) {
      return NextResponse.json(
        { error: "Missing token/db" },
        { status: 400 }
      );
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            return (await cookies()).get(name)?.value;
          },
          async set() {},
          async remove() {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    console.log("USER:", user);

    const id = Math.random().toString(36).substring(2, 8);

    const { error } = await supabaseAdmin.from("widgets").insert({
      id,
      db,
      token,
      user_id: user?.id ?? null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to store widget", detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      embedUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/embed/${id}?db=${db}`,
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: "Server error", detail: err.message },
      { status: 500 }
    );
  }
}
