"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function EmbedFilter() {
  const router = useRouter();
  const params = useSearchParams();

  const current = Object.fromEntries(params.entries());

  const updateFilter = (name: string, value: string) => {
    const newParams = new URLSearchParams(current);

    if (!value || value === "all") newParams.delete(name);
    else newParams.set(name, value);

    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-5 bg-gray-900 p-3 rounded-lg">
      
      {/* Platform */}
      <select
        className="bg-gray-800 p-2 rounded text-white"
        defaultValue={current.platform || "all"}
        onChange={(e) => updateFilter("platform", e.target.value)}
      >
        <option value="all">All Platform</option>
        <option value="Instagram">Instagram</option>
        <option value="Tiktok">Tiktok</option>
        <option value="Others">Others</option>
      </select>

      {/* Status */}
      <select
        className="bg-gray-800 p-2 rounded text-white"
        defaultValue={current.status || "all"}
        onChange={(e) => updateFilter("status", e.target.value)}
      >
        <option value="all">All Status</option>
        <option value="Not started">Not started</option>
        <option value="In progress">In progress</option>
        <option value="Done">Done</option>
      </select>

      {/* Content Pillar */}
      <select
        className="bg-gray-800 p-2 rounded text-white"
        defaultValue={current.pillar || "all"}
        onChange={(e) => updateFilter("pillar", e.target.value)}
      >
        <option value="all">All Pillars</option>
        <option value="Tips and How to">Tips and How to</option>
        <option value="Client Wins">Client Wins</option>
        <option value="Offer and Service">Offer and Service</option>
        <option value="Other">Other</option>
        <option value="Behind the Scenes">Behind the Scenes</option>
      </select>

      {/* Pinned */}
      <select
        className="bg-gray-800 p-2 rounded text-white"
        defaultValue={current.pinned || "all"}
        onChange={(e) => updateFilter("pinned", e.target.value)}
      >
        <option value="all">Pinned + Unpinned</option>
        <option value="true">Pinned Only</option>
        <option value="false">Unpinned Only</option>
      </select>
    </div>
  );
}
