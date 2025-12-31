/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Link2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { getNotionDatabases } from "../lib/widget.api";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { ScrollArea } from "./scroll-area";

interface ConnectStepProps {
  notionUrl: string;
  setNotionUrl: (url: string) => void;
  isUrlValid: boolean;
  setIsUrlValid: (valid: boolean) => void;
  onSelectDb: (dbId: string, name: string) => void;
  onCreateWidget: () => void;
  loading: boolean;
}

export function ConnectStep({
  notionUrl,
  setNotionUrl,
  isUrlValid,
  setIsUrlValid,
  onSelectDb,
  onCreateWidget,
  loading,
}: ConnectStepProps) {
  const [loadingDetect, setLoadingDetect] = useState(false);
  const [databases, setDatabases] = useState<any[]>([]);
  const [detectError, setDetectError] = useState<string | null>(null);
  const [selectedDb, setSelectedDb] = useState<any>(null);

  const validate = (token: string) =>
    token.startsWith("ntn_") && token.length > 20;

  const detectDb = async (token: string) => {
    setLoadingDetect(true);
    setDetectError(null);

    try {
      const data = await getNotionDatabases(token);
      if (!data.data || data.data.length === 0) {
        setDetectError("No databases found or token invalid.");
        return;
      }
      setDatabases(data.data);
    } catch {
      setDetectError("Failed to fetch databases.");
    } finally {
      setLoadingDetect(false);
    }
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setNotionUrl(value);

    const ok = validate(value);
    setIsUrlValid(ok);

    if (!ok) {
      setDatabases([]);
      setDetectError(null);
      return;
    }

    detectDb(value);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Link2 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl">Connect to Notion</h2>
            <p className="text-sm text-gray-600">
              Paste your Notion Integration token
            </p>
          </div>
        </div>

        {/* DRAWER */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg">
              <HelpCircle className="w-4 h-4" />
              Need Help?
            </button>
          </SheetTrigger>

          <SheetContent className="sm:max-w-lg p-0">
            <SheetHeader className="px-6 py-6 border-b">
              <SheetTitle className="text-xl">
                How to Connect Notion
              </SheetTitle>
              <SheetDescription>
                Follow these steps to set up your Notion database
              </SheetDescription>
            </SheetHeader>

            <ScrollArea className="h-[calc(100vh-140px)]">
              <div className="px-6 py-6 space-y-10 text-sm text-gray-600">
                {/* OPTION 1 */}
                <section className="space-y-4">
                  <h3 className="text-base text-gray-900">
                    Option 1 — Use Our Template (Recommended)
                  </h3>
                  <p>
                    Duplicate our ready-to-use template with all
                    required properties configured.
                  </p>
                  <a
                    href="https://www.notion.so/my-integrations"
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
                  >
                    Get Notion Template
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </section>

                <div className="border-t" />

                {/* OPTION 2 */}
                <section className="space-y-4">
                  <h3 className="text-base text-gray-900">
                    Option 2 — Manual Setup
                  </h3>
                  <ol className="space-y-3 list-decimal ml-4">
                    <li>Create a new Notion Integration</li>
                    <li>
                      Copy token that starts with{" "}
                      <code className="bg-gray-100 px-1 rounded">
                        ntn_
                      </code>
                    </li>
                    <li>Share database to the integration</li>
                    <li>Paste token in this form</li>
                  </ol>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs">
                    <strong>💡 Important:</strong> Integration
                    must have access to the database or it won’t
                    show up.
                  </div>
                </section>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* TOKEN INPUT */}
      <div>
        <label className="text-sm">Notion Token</label>
        <div className="relative mt-2">
          <input
            value={notionUrl}
            onChange={handleTokenChange}
            placeholder="ntn_xxxxxxxxxxxx"
            className="w-full px-4 py-3 border rounded-lg"
          />
          {notionUrl && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {loadingDetect ? (
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              ) : isUrlValid ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        {detectError && (
          <p className="text-sm text-red-600 mt-2">
            {detectError}
          </p>
        )}
      </div>

      {/* DATABASE LIST */}
      {databases.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Select Database</p>
          {databases.map((db) => (
            <div
              key={db.id}
              onClick={() => {
                setSelectedDb(db);
                onSelectDb(db.id, db.name);
              }}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedDb?.id === db.id
                  ? "border-purple-600 bg-purple-50"
                  : "hover:border-purple-400"
              }`}
            >
              <p className="font-medium">{db.name}</p>
              <p className="text-xs text-gray-500">{db.id}</p>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onCreateWidget}
        disabled={!selectedDb || !isUrlValid || loading}
        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Widget"}
      </button>
    </div>
  );
}
