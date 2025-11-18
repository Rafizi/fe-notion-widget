/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { queryDatabase } from "@/app/lib/notion-server";
import { getToken } from "@/app/api/embed/route";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  const db = searchParams.get("db");

  if (!id || !db) return NextResponse.json([]);

  const token = await getToken(id);
  const data = await queryDatabase(token, db);

  const mapped = data.map((item: any) => ({
    url:
      item.url ||
      item.properties?.Attachment?.files?.[0]?.file?.url ||
      null,
    name:
      item.properties?.Name?.title?.[0]?.plain_text || "Untitled",
  }));

  return NextResponse.json(mapped);
}
