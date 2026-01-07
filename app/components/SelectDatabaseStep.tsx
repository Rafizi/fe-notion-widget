"use client";

import { useEffect, useState } from "react";
import { Folder, Loader2 } from "lucide-react";
import { getNotionDatabases } from "@/app/lib/widget.api";

interface SelectDatabaseStepProps {
  token: string;
  onSelect: (dbId: string, name: string) => Promise<void> | void;
}

export default function SelectDatabaseStep({
  token,
  onSelect,
}: SelectDatabaseStepProps) {
  const [databases, setDatabases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDb = async () => {
      setLoading(true);
      const res = await getNotionDatabases(token);
      setDatabases(res.data || []);
      setLoading(false);
    };
    fetchDb();
  }, [token]);

  const handleSelect = async (db: any) => {
    setProcessingId(db.id);
    await onSelect(db.id, db.name);
    // gak perlu set null karena biasanya langsung pindah step
  };

  // loading fetch database
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-7 h-7 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select Database</h2>

      {databases.map((db) => {
        const isProcessing = processingId === db.id;

        return (
          <button
            key={db.id}
            disabled={!!processingId}
            onClick={() => handleSelect(db)}
            className="
              w-full p-4 border rounded-lg text-left
              hover:border-purple-500
              disabled:opacity-60
              relative
            "
          >
            {isProcessing ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                <span className="text-sm text-gray-600">
                  Processing database...
                </span>
              </div>
            ) : (
              <div className="flex gap-3">
                <Folder className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium">{db.name}</p>
                  <p className="text-xs text-gray-500">{db.id}</p>
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
