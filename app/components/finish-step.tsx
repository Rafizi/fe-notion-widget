/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LivePreviewBox from "@/app/components/LivePreviewBox";
import { CheckCircle2, Copy } from "lucide-react";
import { useState } from "react";

export default function FinishStep({
  db,
  embedUrl,
  loading,
  onGenerate,
  onBack,
  token
}: any) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(embedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

      {/* LEFT PANEL */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

        <h2 className="text-xl font-bold mb-4">Review & Generate</h2>

        {/* DB ID */}
        <div className="bg-gray-50 border p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-500">Database ID</p>
          <p className="text-gray-900 break-all">{db}</p>
        </div>

        {/* EMBED GENERATED? */}
        {!embedUrl ? (
          <>
            <button
              onClick={onGenerate}
              disabled={loading}
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 transition"
            >
              {loading ? "Creating..." : "Create Widget"}
            </button>

            <button
              onClick={onBack}
              className="mt-4 w-full px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
          </>
        ) : (
          <>
            {/* WIDGET CREATED */}
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-green-700 font-medium">Widget Successfully Created!</p>
            </div>

            {/* URL */}
            <div className="bg-gray-50 border p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-500 mb-1">Widget URL</p>
              <div className="flex items-center gap-3">
                <input
                  readOnly
                  value={embedUrl}
                  className="w-full px-4 py-2 border rounded-lg bg-white"
                />
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 bg-gray-800 text-white rounded-lg text-xs flex items-center gap-1"
                >
                  {copied ? "Copied!" : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* BACK BUTTON */}
            <button
              onClick={onBack}
              className="w-full px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
          </>
        )}
      </div>

      {/* RIGHT — LIVE PREVIEW */}
      <LivePreviewBox token={token} db={db} />
    </div>
  );
}
