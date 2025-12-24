/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Pin, X, ExternalLink } from "lucide-react";
import EmbedFilter from "@/app/components/EmbedFilter";
import RefreshButton from "@/app/components/RefreshButton";

/* ================= TYPES ================= */

type Highlight = {
  title: string;
  image?: string;
};

type Profile = {
  name?: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  highlights?: Highlight[];
};

interface Props {
  filtered: any[];
  profile?: Profile | null;
  theme?: "light" | "dark";
  gridColumns?: number;
}

/* ================= MAIN ================= */

export default function ClientViewComponent({
  filtered = [],
  profile,
  theme = "light",
  gridColumns = 3,
}: Props) {
  const [viewMode, setViewMode] = useState<"visual" | "map">("visual");
  const [showBio, setShowBio] = useState(true);
  const [showHighlight, setShowHighlight] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(theme);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  const bg =
    currentTheme === "light"
      ? "bg-white text-gray-900"
      : "bg-black text-white";

  return (
    <main className={`${bg} min-h-screen w-full flex flex-col`}>
      {/* ================= HEADER ================= */}
      <div
        className={`sticky top-0 z-30 px-5 py-4 border-b backdrop-blur-md ${
          currentTheme === "light"
            ? "bg-white/80 border-gray-200"
            : "bg-black/70 border-gray-800"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-semibold">Creator Gallery</h1>
            <p className="text-xs text-gray-500">
              Curated content from your Notion database
            </p>
          </div>

          <button
            onClick={() =>
              setCurrentTheme((t) => (t === "light" ? "dark" : "light"))
            }
            className={`px-4 py-2 rounded-full text-xs ring-1 mr-40 ${
              currentTheme === "dark"
                ? "bg-gray-800 text-white ring-gray-600"
                : "bg-gray-100 text-gray-900 ring-gray-300"
            }`}
          >
            {currentTheme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>

          <RefreshButton />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full border overflow-hidden text-xs">
            <button
              onClick={() => setViewMode("visual")}
              className={`px-4 py-1.5 ${
                viewMode === "visual"
                  ? "bg-gray-900 text-white"
                  : "bg-transparent"
              }`}
            >
              Visual
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-1.5 ${
                viewMode === "map"
                  ? "bg-gray-900 text-white"
                  : "bg-transparent"
              }`}
            >
              Map
            </button>
          </div>

          <div className="flex gap-2">
            <ToggleChip
              label="Show bio"
              active={showBio}
              onClick={() => setShowBio(!showBio)}
              theme={currentTheme}
            />
            <ToggleChip
              label="Show highlight"
              active={showHighlight}
              onClick={() => setShowHighlight(!showHighlight)}
              theme={currentTheme}
            />
          </div>
        </div>

        <div className="mt-4">
          <EmbedFilter />
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-5 space-y-6">
        {viewMode === "visual" ? (
          <VisualGrid
            filtered={filtered}
            gridColumns={gridColumns}
            showBio={showBio}
            showHighlight={showHighlight}
            onSelect={setSelectedItem}
          />
        ) : (
          <MapViewGrid filtered={filtered} />
        )}
      </div>

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          theme={currentTheme}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </main>
  );
}

/* ================= GRID ================= */

function VisualGrid({
  filtered,
  gridColumns,
  showBio,
  showHighlight,
  onSelect,
}: any) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}
    >
      {filtered.map((item: any, i: number) => (
        <GalleryCard
          key={i}
          item={item}
          showBio={showBio}
          showHighlight={showHighlight}
          onClick={() => onSelect(item)}
        />
      ))}
    </div>
  );
}

/* ================= CARD ================= */

function GalleryCard({
  item,
  showBio,
  showHighlight,
  onClick,
}: any) {
  const [hovered, setHovered] = useState(false);

  const name =
    item.properties?.Name?.title?.[0]?.plain_text || "Untitled";
  const image = extractImage(item);
  const pinned = item.properties?.Pinned?.checkbox;
  const featured = showHighlight && pinned;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative rounded-[12px] overflow-hidden cursor-pointer
        transition-all duration-300 shadow-md hover:shadow-xl
        ${featured ? "ring-4 ring-purple-600" : ""}
        ${hovered ? "-translate-y-1" : ""}
      `}
      style={{ height: "450px" }}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />

      {showBio && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10">
          <p className="text-white text-sm">{name}</p>
        </div>
      )}

      {featured && (
        <div className="absolute top-2 right-2 z-20">
          <div className="bg-purple-600 text-white text-[10px] px-2 py-1 rounded-full">
            ⭐ Featured
          </div>
        </div>
      )}

      {hovered && (
        <>
          <div className="absolute inset-0 bg-black/20 z-20" />

          <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg z-30 animate-in fade-in slide-in-from-top-2 duration-200">
            <ExternalLink className="w-5 h-5 text-purple-600" />
          </div>

          <div className="absolute bottom-4 left-4 right-4 bg-white/95 px-4 py-2 rounded-lg shadow-lg z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <p className="text-gray-900 text-sm font-medium">
              Click to view details
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/* ================= MAP VIEW ================= */

function MapViewGrid({ filtered }: any) {
  const colors = ["bg-[#A3A18C]", "bg-[#CFC6A8]", "bg-[#9FA29A]"];

  return (
    <div className="grid grid-cols-3 gap-px bg-gray-200">
      {filtered.map((item: any, i: number) => (
        <div
          key={i}
          className={`aspect-square flex items-center justify-center ${
            colors[i % colors.length]
          }`}
        >
          <h3 className="text-white text-sm text-center px-3">
            {item.properties?.Name?.title?.[0]?.plain_text}
          </h3>
        </div>
      ))}
    </div>
  );
}

/* ================= UI ================= */

function ToggleChip({ label, active, onClick, theme }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-[11px] border ${
        active
          ? "bg-purple-600 border-purple-600 text-white"
          : theme === "light"
          ? "bg-white border-gray-300"
          : "bg-black border-gray-700 text-gray-300"
      }`}
    >
      {label}
    </button>
  );
}

/* ================= MODAL ================= */

function DetailModal({ item, theme, onClose }: any) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const name =
    item.properties?.Name?.title?.[0]?.plain_text || "Untitled";
  const image = extractImage(item);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-5xl rounded-2xl overflow-hidden ${
          theme === "light" ? "bg-white" : "bg-gray-900"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3 bg-black flex items-center justify-center">
            <img src={image} alt={name} className="object-contain h-full" />
          </div>

          <div className="lg:w-1/3 p-6 space-y-4">
            <h2 className="text-xl font-semibold">{name}</h2>

            <button className="w-full bg-purple-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
              <ExternalLink size={16} /> Open Original
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function extractImage(item: any) {
  const p = item.properties;
  return (
    p.Attachment?.files?.[0]?.file?.url ||
    p.Attachment?.files?.[0]?.external?.url ||
    "/placeholder.png"
  );
}
