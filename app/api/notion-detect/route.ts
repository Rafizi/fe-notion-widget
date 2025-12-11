/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ success: false, error: "Missing Notion token" });
  }

  try {
    const res = await fetch("https://api.notion.com/v1/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filter: {
          property: "object",
          value: "database"
        }
      })
    });

    const data = await res.json();
    console.log("data:" + data);

    const databases = data.results.map((db: any) => ({
      id: db.id,
      name: db.title?.[0]?.plain_text || "Untitled",
      url: db.url,
      last_edited_time: db.last_edited_time,
      icon: db.icon || null
    }));

    return NextResponse.json({
      databases,
      total: databases.length
    });

  } catch (e) {
    return NextResponse.json({ success: false, error: "Failed to fetch" });
  }
}
