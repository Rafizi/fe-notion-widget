"use client";

import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";

export default function RefreshButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.refresh()}
      title="Refresh"
      className="
        w-9 h-9
        flex items-center justify-center
        rounded-full
        border
        transition
        hover:bg-gray-100
        dark:hover:bg-gray-800
      "
    >
      <RotateCw size={16} />
    </button>
  );
}
