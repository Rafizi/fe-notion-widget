"use client";

import { useState, useEffect } from "react";
import NotionConnectForm from "@/app/components/NotionConnectForm";

export default function CreateWidgetPage() {
  const [token, setToken] = useState<string | null>(null);
  const [db, setDb] = useState<string | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // AUTO GENERATE EMBED WHEN token + db ready
  useEffect(() => {
    if (!token || !db) return;

    const generate = async () => {
      setLoading(true);
      const res = await fetch("/api/embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, db }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setEmbedUrl(data.embedUrl);
      }
    };

    generate();
  }, [token, db]);

  return (
    <div className="w-full min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Create Widget</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT SIDE */}
        <div className="bg-gray-900 p-6 rounded-xl space-y-6">
          <h2 className="text-xl font-semibold">Notion Setup</h2>

          {!token || !db ? (
            <NotionConnectForm
              onReady={({ token, db }) => {
                setToken(token);
                setDb(db);
              }}
            />
          ) : (
            <>
              <div className="text-sm text-gray-300 space-y-1">
                <p>
                  <strong>Token:</strong> {token.slice(0, 4)}••••••
                </p>
                <p>
                  <strong>Database:</strong> {db}
                </p>
              </div>

              {loading && (
                <p className="text-purple-400 text-sm">
                  ⏳ Generating embed link…
                </p>
              )}

              {embedUrl && (
                <>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-400 mb-1">Embed URL:</p>

                    {/* COPY BUTTON */}
                    <button
                      onClick={() => navigator.clipboard.writeText(embedUrl)}
                      className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-xs"
                    >
                      Copy 📋
                    </button>
                  </div>

                  <a
                    href={embedUrl}
                    className="text-purple-400 underline break-all"
                    target="_blank"
                  >
                    {embedUrl}
                  </a>

                  {/* Refresh Button */}
                  <button
                    onClick={() => setDb((prev) => prev)} // trigger re-fetch
                    className="mt-3 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm"
                  >
                    Refresh Data 🔄
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* RIGHT SIDE — IFRAME PREVIEW */}
        <div className="bg-gray-900 p-6 rounded-xl min-h-[600px]">
          <h2 className="text-xl font-semibold mb-4">Live Preview</h2>

          {!embedUrl ? (
            <p className="text-gray-500">Fill the form to load preview…</p>
          ) : (
            <iframe
              src={embedUrl}
              style={{
                width: "100%",
                height: "600px",
                border: "0",
                borderRadius: "8px",
                background: "#111",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
