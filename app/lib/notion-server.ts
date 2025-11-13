/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "@notionhq/client";

export async function queryDatabase(token: string, db: string) {
  const notion = new Client({ auth: token });

  try {
    const response = await notion.databases.query({
      database_id: db,
      sorts: [
        { property: "Publish Date", direction: "descending" }
      ],
    });

    return response.results;
  } catch (error: any) {
    console.error(" Notion API Error:", error);
    throw new Error(error.message || "Failed to fetch Notion data");
  }
}
