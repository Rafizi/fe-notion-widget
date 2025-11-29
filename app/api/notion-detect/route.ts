/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

const NOTION_TOKEN = process.env.NOTION_TOKEN_V2;

const headers = {
  "Content-Type": "application/json;charset=UTF-8",
  Cookie: `token_v2=${NOTION_TOKEN}`,
};

const cleanId = (id: string) => id.replace(/-/g, "");

export async function POST(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ success: false, error: "Missing ID" });

  try {
    let pageId = id;

    // ========== 1. Resolve ntn_ token → get real parent page ==========
    if (id.startsWith("ntn_")) {
      const r = await fetch("https://www.notion.so/api/v3/getRecordValues", {
        method: "POST",
        headers,
        body: JSON.stringify({
          requests: [{ id, table: "collection" }],
        }),
      });

      const json = await r.json();
      const c = json?.results?.[0]?.value;

      if (!c) {
        return NextResponse.json({
          success: false,
          error: "Invalid token or collection not found",
        });
      }

      pageId = cleanId(c.parent_id);
    }

    pageId = cleanId(pageId);

    // ========== 2. Get BLOCK (page) ==========
    const pageRes = await fetch("https://www.notion.so/api/v3/getRecordValues", {
      method: "POST",
      headers,
      body: JSON.stringify({
        requests: [{ id: pageId, table: "block" }],
      }),
    });

    const pageJson = await pageRes.json();
    const block = pageJson?.results?.[0]?.value;

    if (!block) {
      return NextResponse.json({
        success: false,
        error: "Page not found or private",
      });
    }

    const collectionId = block.collection_id;
    const viewId = block.view_ids?.[0];

    if (!collectionId || !viewId) {
      return NextResponse.json({
        success: false,
        error: "This is not a Notion database page",
      });
    }

    // ========== 3. Fetch collection + view ==========
    const detailRes = await fetch(
      "https://www.notion.so/api/v3/getRecordValues",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          requests: [
            { id: collectionId, table: "collection" },
            { id: viewId, table: "collection_view" },
          ],
        }),
      }
    );

    const detailJson = await detailRes.json();

    const collection = detailJson?.results?.[0]?.value;
    const view = detailJson?.results?.[1]?.value;

    if (!collection || !view) {
      return NextResponse.json({
        success: false,
        error: "Cannot fetch database schema",
      });
    }

    // ========== 4. Extract info ==========
    const schema = collection.schema || {};

    const titleField = Object.keys(schema).find(
      (k) => schema[k].type === "title"
    );
    const imageField = Object.keys(schema).find(
      (k) => schema[k].type === "file"
    );
    const statusField = Object.keys(schema).find(
      (k) => ["select", "status"].includes(schema[k].type)
    );

    return NextResponse.json({
      success: true,
      title: collection.name?.[0]?.[0] ?? "Untitled",
      icon: block.format?.page_icon ?? null,
      dbId: collection.id,
      viewId: view.id,
      viewType: view.type,
      viewName: view.name,
      schemaCount: Object.keys(schema).length,
      publicUrl: `https://www.notion.so/${pageId}?v=${cleanId(view.id)}`,
      fields: { titleField, imageField, statusField },
    });
  } catch (e) {
    return NextResponse.json({
      success: false,
      error: "Server error",
    });
  }
}
