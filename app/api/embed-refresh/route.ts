import { NextResponse } from "next/server";
import { queryDatabase } from "@/app/lib/notion-server";
import { getToken } from "@/app/lib/getToken";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const db = searchParams.get("db");

  if (!id || !db) return NextResponse.json([]);

  const token = await getToken(id);
  const data = await queryDatabase(token, db);

  return NextResponse.json(data);
}
