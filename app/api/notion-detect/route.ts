/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id } = await req.json();

  try {
    const res = await fetch("https://www.notion.so/api/v3/getPublicPageData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({ pageId: id }),
    });

    const data = await res.json();

    if (!data || data.error) {
      return NextResponse.json({
        success: false,
        error: "Database is private or invalid.",
      });
    }

    // ROOT BLOCK
    const block = data?.recordMap?.block?.[id]?.value;
    const pageUUID = block?.id?.replace(/-/g, "") || null;

    // COLLECTION & SCHEMA
    const collectionObj: any = data?.recordMap?.collection
      ? Object.values(data.recordMap.collection)[0]
      : null;
    const collection = collectionObj?.value || null;
    const schema = collection?.schema || {};

    // VIEW FIX (PORTOLABS-STYLE)
    const viewKey = Object.keys(data?.recordMap?.collection_view || {})[0] || null;
    const viewObj: any = viewKey
      ? data.recordMap.collection_view[viewKey].value
      : null;

    // ⭐ IMPORTANT: Build URL even if view is missing
    let publicUrl = null;

    if (pageUUID && viewKey) {
      publicUrl = `https://www.notion.so/${pageUUID}?v=${viewKey}`;
    } else if (pageUUID) {
      // ⭐ fallback if DB has no view
      publicUrl = `https://www.notion.so/${pageUUID}`;
    }

    return NextResponse.json({
      success: true,
      title:
        block?.properties?.title?.[0]?.[0] || "Untitled Database",
      icon:
        block?.format?.page_icon ||
        block?.format?.block_icon ||
        null,
      propertiesCount: Object.keys(schema).length,
      publicUrl, // ⭐ ALWAYS present now
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to fetch Notion data.",
    });
  }
}
