/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "@/app/api/embed/route";
import { queryDatabase } from "@/app/lib/notion-server";

function extractImage(item: any) {
  const props = item.properties;

  if (props.Attachment?.files?.length > 0) {
    const file = props.Attachment.files[0];

    if (file.external?.url?.includes("canva.com")) {
      return "/canva-placeholder.png";
    }

    return file.file?.url || file.external?.url;
  }

  const linkText = props["*Link"]?.rich_text?.[0]?.plain_text;
  if (linkText) {
    if (linkText.includes("canva.com")) {
      return "/canva-placeholder.png";
    }
    return linkText;
  }

  const canvaUrl = props["*Canva Link"]?.url;
  if (canvaUrl) {
    if (canvaUrl.includes("canva.com")) {
      return "/canva-placeholder.png";
    }
    return canvaUrl;
  }

  return "/placeholder.png";
}

export default async function EmbedPage(props: any) {
  try {
    const paramsObj = await props.params;
    const searchObj = await props.searchParams;

    const id = paramsObj.id;
    const db = searchObj?.db;

    if (!db) {
      return <p style={{ color: "red" }}> Missing database ID.</p>;
    }

    const token = getToken(id);
    if (!token) {
      return <p style={{ color: "red" }}>Invalid or expired embed link.</p>;
    }

    const data = await queryDatabase(token, db);

    return (
      <main className="bg-black min-h-screen p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.map((item: any, i: number) => {
            const img = extractImage(item);
            return (
              <div key={i} className="bg-gray-900 rounded-lg overflow-hidden">
                <img
                  src={img}
                  alt="Notion Image"
                  className="object-cover w-full h-40"
                />
              </div>
            );
          })}
        </div>
      </main>
    );
  } catch (err: any) {
    return (
      <p style={{ color: "red", padding: 20 }}>
         Error: {err?.message || "Unknown server error"}
      </p>
    );
  }
}
