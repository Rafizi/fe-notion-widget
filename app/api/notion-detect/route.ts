/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

const NOTION_TOKEN = process.env.NOTION_TOKEN_V2;

// helper clean uuid → remove dashes
function cleanId(id: string) {
  return id.replace(/-/g, "");
}

export async function POST(req: Request) {
  const { id } = await req.json();

  if (!NOTION_TOKEN) {
    return NextResponse.json({
      success: false,
      error: "NOTION_TOKEN_V2 is not configured on the server.",
    });
  }

  try {
    // =====================================
    // 1) RESOLVE THE ntn_ → collection_view
    // =====================================
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
    const viewValue = viewData?.results?.[0]?.value;

    if (!viewValue) {
      return NextResponse.json({
        success: false,
        error: "Invalid or private database (cannot resolve collection_view).",
      });
    }

    const collectionId = viewValue.collection_id;
    const viewId = viewValue.id;
    const viewType = viewValue.type || "unknown";
    const viewName = viewValue.name?.[0]?.[0] || "Default View";

    // =====================================
    // 2) FETCH DATABASE COLLECTION
    // =====================================
    const collectionRes = await fetch(
      "https://www.notion.so/api/v3/getRecordValues",
      {
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
      }
    );

    const colData = await collectionRes.json();
    const col = colData?.results?.[0]?.value;

    if (!col) {
      return NextResponse.json({
        success: false,
        error: "Invalid or private database (cannot resolve collection).",
      });
    }

    // title + icon
    const title = col.name?.[0]?.[0] || "Untitled Database";
    const icon =
      col.icon?.emoji ||
      col.icon?.file_url ||
      col.cover_url ||
      null;

    const schema = col.schema || {};

    // =====================================
    // 3) DETECT IMAGE FIELD + TEXT FIELD + STATUS FIELD
    // =====================================
    let imageField: null = null;
    let titleField: null = null;
    let statusField: null = null;

    Object.entries(schema).forEach(([propId, prop]: any) => {
      if (!titleField && prop.type === "title") titleField = prop.name;
      if (!imageField && prop.type === "file") imageField = prop.name;
      if (!statusField && prop.type === "status") statusField = prop.name;
    });

    // =====================================
    // 4) REAL DATABASE URL (SAME AS NOTION)
    // =====================================
    const cleanPageId = cleanId(collectionId);
    const publicUrl = `https://www.notion.so/${cleanPageId}?v=${cleanId(viewId)}`;

    // FINAL RESPONSE
    return NextResponse.json({
      success: true,
      title,
      icon,
      dbId: collectionId,
      viewId,
      viewType,
      viewName,
      schemaCount: Object.keys(schema).length,
      publicUrl,
      fields: {
        titleField,
        imageField,
        statusField,
      },
    });
  } catch (err) {
    console.error("[NOTION DETECT ERROR]", err);
    return NextResponse.json({
      success: false,
      error: "Failed to request Notion API.",
    });
  }
}
