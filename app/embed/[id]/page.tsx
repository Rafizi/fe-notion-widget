/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "@/app/api/embed/route";
import AutoThumbnail from "@/app/components/AutoThumbnail";
import { queryDatabase } from "@/app/lib/notion-server";

function extractImage(item: any) {
  const props = item.properties;

  const isVideoUrl = (url: string) =>
    /(mp4|mov|avi|webm|mkv)(?=($|\?|&))/i.test(url);

  if (props.Attachment?.files?.length > 0) {
    const file = props.Attachment.files[0];
    const url = file.file?.url || file.external?.url;

    if (url?.includes("canva.com")) return "/canva-placeholder.png";
    if (url && isVideoUrl(url)) return url;

    return url;
  }

  const linkText = props["*Link"]?.rich_text?.[0]?.plain_text;
  if (linkText) {
    if (linkText.includes("canva.com")) return "/canva-placeholder.png";
    if (isVideoUrl(linkText)) return linkText;

    return linkText;
  }

  const canvaUrl = props["*Canva Link"]?.url;
  if (canvaUrl) {
    if (canvaUrl.includes("canva.com")) return "/canva-placeholder.png";
    if (isVideoUrl(canvaUrl)) return canvaUrl;

    return canvaUrl;
  }

  return "/placeholder.png";
}

/** 👉 Ambil NAME dari database Notion */
function extractName(item: any) {
  return item.properties?.Name?.title?.[0]?.plain_text || "Untitled";
}

export default async function EmbedPage(props: any) {
  try {
    const paramsObj = await props.params;
    const searchObj = await props.searchParams;

    const id = paramsObj.id;
    const db = searchObj?.db;

    if (!db)
      return errorBox("Database ID not valid. / Token error.");

    const token = await getToken(id);
    if (!token)
      return errorBox("Token not valid. / Token error.");

    const data = await queryDatabase(token, db);

    return (
      <main className="bg-black min-h-screen p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          {data.slice(0, 3).map((item: any, i: number) => {
            const url = extractImage(item);
            const name = extractName(item);

            return (
              <div key={i} className="bg-gray-900 rounded-lg overflow-hidden">

                {/* Instagram ratio 4:5 */}
                <div className="aspect-[4/5] w-full overflow-hidden bg-gray-800">
                  <AutoThumbnail src={url} />
                </div>

                <p className="text-white text-center py-2 text-sm">
                  {name}
                </p>
              </div>
            );
          })}
        </div>
      </main>
    );
  } catch (err: any) {
    return errorBox(err?.message || "Unknown server error");
  }
}

function errorBox(text: string) {
  return (
    <div className="p-4 bg-red-900 border border-red-600 text-red-300 rounded-lg m-4">
      {text}
    </div>
  );
}

