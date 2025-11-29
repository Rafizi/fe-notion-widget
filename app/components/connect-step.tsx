/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ConnectStepProps {
  notionUrl: string;
  setNotionUrl: (url: string) => void;
  isUrlValid: boolean;
  setIsUrlValid: (valid: boolean) => void;
  onNext: () => void;
}

export function ConnectStep({
  notionUrl,
  setNotionUrl,
  isUrlValid,
  setIsUrlValid,
  onNext,
}: ConnectStepProps) {
  const [loadingDetect, setLoadingDetect] = useState(false);
  const [databases, setDatabases] = useState<any[]>([]);
  const [detectError, setDetectError] = useState<string | null>(null);
  const [selectedDb, setSelectedDb] = useState<any>(null);

  /** VALIDATOR → hanya token ntn_ */
  const validate = (input: string) => {
    return input.startsWith("ntn_") && input.length > 20;
  };

  /** KIRIM TOKEN ke backend → fetch all databases */
  const detectDb = async (token: string) => {
    setLoadingDetect(true);
    setDetectError(null);
    setDatabases([]);
    setSelectedDb(null);

    try {
      const res = await fetch("/api/notion-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      setLoadingDetect(false);

      if (!data.databases) {
        setDetectError("No databases found or token invalid.");
        return;
      }

      setDatabases(data.databases);

    } catch (err) {
      setLoadingDetect(false);
      setDetectError("Failed to fetch databases.");
    }
  };

  /** HANDLE INPUT CHANGE */
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();
    setNotionUrl(raw);

    const ok = validate(raw);
    setIsUrlValid(ok);

    if (!ok) {
      setDatabases([]);
      setDetectError(null);
      return;
    }

    detectDb(raw);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <Link2 className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl text-gray-900">Connect to Notion</h2>
          <p className="text-sm text-gray-600">Paste your Notion integration token</p>
        </div>
      </div>

      {/* INPUT TOKEN */}
      <div>
        <label className="block text-sm text-gray-700 mb-2">Notion Token</label>

        <div className="relative">
          <input
            type="text"
            value={notionUrl}
            onChange={handleUrlChange}
            placeholder="ntn_xxxxxxxxxxxxx"
            className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900
              placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all
              ${
                notionUrl === ""
                  ? "border-gray-300 focus:ring-purple-500"
                  : isUrlValid
                  ? "border-green-500 focus:ring-green-500"
                  : "border-red-500 focus:ring-red-500"
              }`}
          />

          {/* STATUS ICON */}
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

        {detectError && <p className="text-sm text-red-600 mt-2">{detectError}</p>}
      </div>

      {/* LIST DATABASES */}
      {databases.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 font-medium">Select Database</p>

          {databases.map((db) => (
            <div
              key={db.id}
              onClick={() => setSelectedDb(db)}
              className={`p-4 border rounded-lg cursor-pointer transition 
                ${
                  selectedDb?.id === db.id
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-300 hover:border-purple-400"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{db.icon?.emoji || "📁"}</span>
                <div>
                  <p className="text-gray-900 font-medium">{db.name}</p>
                  <p className="text-gray-600 text-sm">{db.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NEXT BUTTON */}
      <button
        onClick={onNext}
        disabled={!selectedDb}
        className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 
        text-white rounded-lg transition-colors disabled:opacity-50
        disabled:cursor-not-allowed"
      >
        Continue to Customize
      </button>
    </div>
  );
}
