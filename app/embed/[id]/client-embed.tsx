/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import AutoThumbnail from "@/app/components/AutoThumbnail";

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

function extractName(item: any) {
  return item.properties?.Name?.title?.[0]?.plain_text || "Untitled";
}

export default function ClientEmbed({ initialData, id, db }: any) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setRefreshing(true);
    const res = await fetch(`/api/embed-refresh?id=${id}&db=${db}`);
    const newData = await res.json();
    setData(newData);
    setRefreshing(false);
  };

  return (
    <main className="bg-black min-h-screen p-4">
      
      {/* Refresh Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={loadData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {data.map((item: any, i: number) => {
          const url = extractImage(item);
          const name = extractName(item);

          return (
            <div
              key={i}
              className="relative group bg-gray-900 rounded-lg overflow-hidden"
            >
              <AutoThumbnail src={url} />

              <div
                className="
                  absolute inset-0 bg-black/60
                  opacity-0 group-hover:opacity-100
                  transition-all duration-300
                  flex items-center justify-center
                "
              >
                <p className="text-white font-semibold text-center px-2 text-sm">
                  {name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
