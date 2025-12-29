"use client";

import { ChevronDown, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const filterOptions = {
  platform: ["All Platform", "Instagram", "Tiktok", "Others"],
  status: ["All Status", "Not started", "In progress", "Done"],
  pillar: [
    "All Pillars",
    "Tips and How to",
    "Client Wins",
    "Offer and Service",
    "Other",
    "Behind the Scenes",
  ],
  pinned: ["Pinned + Unpinned", "Pinned Only", "Unpinned Only"],
};

const defaultValue = {
  platform: "All Platform",
  status: "All Status",
  pillar: "All Pillars",
  pinned: "Pinned + Unpinned",
};

export default function EmbedFilter() {
  const router = useRouter();
  const params = useSearchParams();

  const [open, setOpen] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  /* ================= MOBILE DETECT ================= */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ================= CURRENT VALUE ================= */
  const current = {
    platform: params.get("platform") ?? defaultValue.platform,
    status: params.get("status") ?? defaultValue.status,
    pillar: params.get("pillar") ?? defaultValue.pillar,
    pinned:
      params.get("pinned") === "true"
        ? "Pinned Only"
        : params.get("pinned") === "false"
        ? "Unpinned Only"
        : defaultValue.pinned,
  };

  /* ================= ACTION ================= */
  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(params.toString());

    if (value === defaultValue[key as keyof typeof defaultValue]) {
      newParams.delete(key);
    } else {
      if (key === "pinned") {
        newParams.set(
          key,
          value === "Pinned Only"
            ? "true"
            : value === "Unpinned Only"
            ? "false"
            : "all"
        );
      } else {
        newParams.set(key, value);
      }
    }

    router.push(`?${newParams.toString()}`);
    setOpen(null);
  };

  const clearAll = () => {
    const newParams = new URLSearchParams();
    const db = params.get("db");
    if (db) newParams.set("db", db);
    router.push(`?${newParams.toString()}`);
  };

  const isActive = (key: string) =>
    current[key as keyof typeof current] !==
    defaultValue[key as keyof typeof defaultValue];

  const activeCount = Object.keys(current).filter(isActive).length;

  /* ================= UI ================= */
  return (
    <div className="mb-6">
      {/* overlay GLOBAL */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(null)}
        />
      )}

      {/* FILTER BAR */}
      <div
        className="
          bg-white border border-gray-200 rounded-xl p-4
          flex flex-wrap gap-2 items-center
        "
      >
        {Object.entries(current).map(([key, value]) => (
          <div key={key} className="relative w-full sm:w-auto">
            <button
              onClick={() => setOpen(open === key ? null : key)}
              className={`
                px-4 py-2 rounded-lg flex items-center gap-3
                w-full sm:min-w-[170px] sm:w-auto
                border text-sm transition
                ${
                  isActive(key)
                    ? "bg-purple-50 border-purple-300 text-purple-700"
                    : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <span className="truncate">{value}</span>
              <ChevronDown className="w-4 h-4 ml-auto shrink-0" />
            </button>

            {open === key && (
              <div
                className={`
                  z-50 bg-white border border-gray-200 shadow
                  ${isMobile
                    ? "fixed bottom-0 left-0 right-0 rounded-t-2xl"
                    : "absolute mt-2 left-0 right-0 rounded-lg"}
                `}
              >
                {isMobile && (
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-2" />
                )}

                <div className="max-h-[260px] overflow-y-auto">
                  {filterOptions[key as keyof typeof filterOptions].map(
                    (opt) => (
                      <button
                        key={opt}
                        onClick={() => updateFilter(key, opt)}
                        className={`
                          w-full px-4 py-2 text-left text-sm transition
                          ${
                            value === opt
                              ? "bg-purple-50 text-purple-700"
                              : "hover:bg-gray-100"
                          }
                        `}
                      >
                        {opt}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="sm:ml-auto text-sm text-gray-500 hover:text-gray-900"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ACTIVE CHIPS */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.entries(current).map(
            ([key, value]) =>
              isActive(key) && (
                <div
                  key={key}
                  className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  <span className="capitalize">{key}</span>
                  <span className="truncate max-w-[140px]">{value}</span>
                  <button
                    onClick={() =>
                      updateFilter(
                        key,
                        defaultValue[key as keyof typeof defaultValue]
                      )
                    }
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
