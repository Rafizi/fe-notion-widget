"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import AutoThumbnail from "@/app/components/AutoThumbnail";
import EmbedFilter from "@/app/components/EmbedFilter";
import RefreshButton from "@/app/components/RefreshButton";
import { Pin, LayoutGrid, List, Palette } from "lucide-react";

type ViewMode = "visual" | "map" | "canva";

export default function ClientViewComponent({ filtered }: { filtered: any[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("canva"); // default langsung ke Canva Design view

  return (
    <main className="bg-black min-h-screen p-4 text-white">
      {/* Filter bar dari Notion params */}
      <EmbedFilter />

      {/* View switcher ala segmented control */}
      <div className="mt-4 mb-6 flex justify-center">
        <div className="inline-flex items-center bg-gray-900 rounded-full p-1 gap-1">
          <ViewTab
            icon={<LayoutGrid className="w-4 h-4" />}
            label="Visual"
            active={viewMode === "visual"}
            onClick={() => setViewMode("visual")}
          />
          <ViewTab
            icon={<List className="w-4 h-4" />}
            label="Map"
            active={viewMode === "map"}
            onClick={() => setViewMode("map")}
          />
          <ViewTab
            icon={<Palette className="w-4 h-4" />}
            label="Canva design"
            active={viewMode === "canva"}
            onClick={() => setViewMode("canva")}
          />
        </div>
      </div>

      {/* VISUAL VIEW – grid thumbnail (kayak awal) */}
      {viewMode === "visual" && (
        <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
          {filtered.map((item: any, i: number) => {
            const name = extractName(item);
            const url = extractImage(item);
            const isPinned = item.properties?.Pinned?.checkbox === true;

            return (
              <div
                key={i}
                className="relative group bg-gray-900 rounded-lg overflow-hidden aspect-4/5 hover:scale-[1.02] transition"
              >
                {isPinned && (
                  <div className="absolute top-2 right-2 z-20">
                    <Pin
                      className="w-5 h-5 text-yellow-400 drop-shadow"
                      fill="yellow"
                    />
                  </div>
                )}

                <AutoThumbnail src={url} />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <p className="text-white font-semibold text-center px-2 text-sm">
                    {name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MAP VIEW – table / content map */}
      {viewMode === "map" && (
        <div className="bg-gray-950/60 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-900">
              <tr>
                <Th>Pin</Th>
                <Th>Title</Th>
                <Th>Platform</Th>
                <Th>Status</Th>
                <Th>Pillar</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item: any, i: number) => {
                const name = extractName(item);
                const platform =
                  item.properties?.Platform?.select?.name || "-";
                const status =
                  item.properties?.Status?.status?.name ||
                  item.properties?.Status?.select?.name ||
                  item.properties?.Status?.multi_select?.[0]?.name ||
                  "-";
                const pillar =
                  item.properties?.["Content Pillar"]?.select?.name || "-";
                const isPinned = item.properties?.Pinned?.checkbox === true;

                return (
                  <tr
                    key={i}
                    className="border-t border-gray-800 hover:bg-gray-900/70 transition"
                  >
                    <td className="px-3 py-2">
                      {isPinned && (
                        <Pin
                          className="w-4 h-4 text-yellow-400"
                          fill="yellow"
                        />
                      )}
                    </td>
                    <td className="px-3 py-2">{name}</td>
                    <td className="px-3 py-2">{platform}</td>
                    <td className="px-3 py-2">{status}</td>
                    <td className="px-3 py-2">{pillar}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CANVA DESIGN VIEW – ini yang match video bro */}
      {viewMode === "canva" && (
        <div className="space-y-4">
          {filtered.map((item: any, i: number) => {
            const name = extractName(item);
            const url = extractImage(item);
            const platform =
              item.properties?.Platform?.select?.name || "Unknown";
            const status =
              item.properties?.Status?.status?.name ||
              item.properties?.Status?.select?.name ||
              item.properties?.Status?.multi_select?.[0]?.name ||
              "No status";
            const pillar =
              item.properties?.["Content Pillar"]?.select?.name ||
              "No pillar";
            const isPinned = item.properties?.Pinned?.checkbox === true;

            // Optional: caption/notes kalau ada
            const caption =
              item.properties?.Caption?.rich_text?.[0]?.plain_text ||
              item.properties?.Notes?.rich_text?.[0]?.plain_text ||
              "";

            return (
              <div
                key={i}
                className="
                  flex gap-4 items-stretch
                  bg-white text-black rounded-2xl
                  p-4 md:p-5
                  shadow-[0_20px_40px_rgba(0,0,0,0.35)]
                  hover:shadow-[0_24px_50px_rgba(0,0,0,0.5)]
                  hover:-translate-y-0.5
                  transition-all duration-200
                "
              >
                {/* thumbnail area */}
                <div className="w-40 md:w-52 aspect-[4/5] rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                  <AutoThumbnail src={url} />
                </div>

                {/* content area */}
                <div className="flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-base md:text-lg leading-snug line-clamp-2">
                        {name}
                      </h3>

                      {isPinned && (
                        <Pin className="w-4 h-4 text-yellow-500 mt-1" fill="#FACC15" />
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs md:text-[11px]">
                      <Badge>{platform}</Badge>
                      <Badge variant="subtle">{status}</Badge>
                      <Badge variant="outline">{pillar}</Badge>
                    </div>

                    {caption && (
                      <p className="mt-3 text-xs md:text-sm text-gray-700 line-clamp-3">
                        {caption}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] md:text-xs text-gray-500">
                      Auto-synced from Notion
                    </span>

                    {/* Placeholder CTA – bisa lu ganti open Notion / open link */}
                    <button
                      className="
                        px-3 py-1.5 rounded-full
                        bg-black text-white
                        text-xs md:text-[11px] font-medium
                        hover:bg-gray-900
                        transition
                      "
                    >
                      Open design
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6">
        <RefreshButton />
      </div>
    </main>
  );
}

/* Small UI helpers */

function ViewTab(props: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={props.onClick}
      className={`flex items-center gap-1 px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm transition ${
        props.active ? "bg-white text-black shadow-sm" : "text-gray-300"
      }`}
    >
      {props.icon}
      <span>{props.label}</span>
    </button>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-300">
      {children}
    </th>
  );
}

function Badge({
  children,
  variant = "solid",
}: {
  children: React.ReactNode;
  variant?: "solid" | "subtle" | "outline";
}) {
  const base =
    "inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] uppercase tracking-wide";
  const styles =
    variant === "outline"
      ? "border-gray-400 text-gray-700 bg-transparent"
      : variant === "subtle"
      ? "border-transparent bg-gray-100 text-gray-700"
      : "border-transparent bg-black text-white";

  return <span className={`${base} ${styles}`}>{children}</span>;
}

/* Data helpers */

function extractName(item: any) {
  return item.properties?.Name?.title?.[0]?.plain_text || "Untitled";
}

function extractImage(item: any) {
  const props = item.properties;

  const isVideoUrl = (url: string) =>
    /(mp4|mov|avi|webm|mkv)(?=($|\?|&))/i.test(url);

  if (props.Attachment?.files?.length > 0) {
    const file = props.Attachment.files[0];
    const url = file.file?.url || file.external?.url;
    if (!url) return "/placeholder.png";
    if (url.includes("canva.com")) return "/canva-placeholder.png";
    if (isVideoUrl(url)) return url;
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
