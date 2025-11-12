/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryDatabase } from "@/app/lib/notion-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token, db } = await req.json();
  if (!token || !db)
    return NextResponse.json({ error: "Missing token/db" }, { status: 400 });

  try {
    const results = await queryDatabase(token, db);
    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
