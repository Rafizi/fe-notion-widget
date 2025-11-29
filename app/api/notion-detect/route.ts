/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

const NOTION_TOKEN = process.env.NOTION_TOKEN_V2;

export async function POST(req: Request) {
  const { id } = await req.json();

  if (!NOTION_TOKEN) {
    return NextResponse.json({
      success: false,
      error: "NOTION_TOKEN_V2 is not configured on the server.",
    });
  }

  try {
    // =========================
    // 1. REQUEST COLLECTION_VIEW
    // =========================
    const viewRes = await fetch("https://www.notion.so/api/v3/getRecordValues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Cookie: `token_v2=${NOTION_TOKEN}`,
      },
      body: JSON.stringify({
        requests: [
          {
            id,
            table: "collection_view",
          },
        ],
      }),
    });

    const viewData = await viewRes.json();
    const view = viewData?.results?.[0]?.value;

    if (!view || !view.collection_id) {
      return NextResponse.json({
        success: false,
        error: "Database is private or invalid.",
      });
    }

    const collectionId = view.collection_id;

    // =========================
    // 2. REQUEST COLLECTION (DATABASE)
    // =========================
    const colRes = await fetch("https://www.notion.so/api/v3/getRecordValues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Cookie: `token_v2=${NOTION_TOKEN}`,
      },
      body: JSON.stringify({
        requests: [
          {
            id: collectionId,
            table: "collection",
          },
        ],
      }),
    });

    const colData = await colRes.json();
    const collection = colData?.results?.[0]?.value;

    if (!collection) {
      return NextResponse.json({
        success: false,
        error: "Database is private or invalid.",
      });
    }

    const title = collection?.name?.[0]?.[0] || "Untitled Database";
    const schema = collection?.schema || {};

    // =========================
    // SUCCESS RESPONSE
    // =========================
    return NextResponse.json({
      success: true,
      title,
      propertiesCount: Object.keys(schema).length,
      publicUrl: `https://www.notion.so/${collectionId.replace(/-/g, "")}`,
    });
  } catch (err) {
    console.error("[notion-detect error]", err);
    return NextResponse.json({
      success: false,
      error: "Failed to request Notion API.",
    });
  }
}
