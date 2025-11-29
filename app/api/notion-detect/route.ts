/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();

  try {
    const res = await fetch("https://www.notion.so/api/v3/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Cookie": `token_v2=${token}`,
      },
      body: JSON.stringify({
        type: "database",
        limit: 100,
        query: "",
        filters: {
          isNavigable: true,
          requireEditPermissions: false,
        },
      }),
    });

    const data = await res.json();

    const results = data?.results || [];

    const databases = results.map((item: any) => ({
      id: item.id,
      name: item.name,
      url: item.url,
      icon: item.icon,
      last_edited_time: item.last_edited_time,
    }));

    return NextResponse.json({
      databases,
      total: databases.length,
    });
  } catch (err) {
    console.error("FETCH ERROR:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch" });
  }
}
