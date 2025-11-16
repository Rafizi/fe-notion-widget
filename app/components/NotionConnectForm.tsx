'use client';
import { useState } from 'react';

export default function NotionConnectForm({ onReady }: { onReady: (p: { token: string; db: string }) => void }) {
  const [token, setToken] = useState('');
  const [dbInput, setDbInput] = useState('');
  const [previewId, setPreviewId] = useState<string | null>(null);

  // --- Extract Function ---
  const extractNotionId = (value: string): string | null => {
    try {
      let cleaned = value.trim();

      // Ambil segment terakhir dari URL
      cleaned = cleaned.split('/').pop() || cleaned;

      // Hilangkan query params
      cleaned = cleaned.split('?')[0];

      // Hilangkan tanda "-"
      cleaned = cleaned.replace(/-/g, '');

      // Valid Notion DB ID = 32 chars
      if (cleaned.length === 32) return cleaned;

      return null;
    } catch {
      return null;
    }
  };

  const handleSubmit = () => {
    const extracted = extractNotionId(dbInput);

    if (!extracted) {
      alert("Bro, URL/ID Notion lo nggak valid ");
      return;
    }

    onReady({ token, db: extracted });
  };

  const handleDbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDbInput(value);

    const extracted = extractNotionId(value);
    setPreviewId(extracted);
  };

  return (
    <div className="space-y-3">
      <input
        className="border p-2 w-full rounded"
        placeholder="Internal Integration Secret (ntn_...)"
        value={token}
        onChange={e => setToken(e.target.value)}
      />

      <input
        className="border p-2 w-full rounded"
        placeholder="Paste Notion Database URL / ID"
        value={dbInput}
        onChange={handleDbChange}
      />

      {/* Live Preview ID */}
      {previewId && (
        <p className="text-xs text-green-400">
          🔍 Database ID terdeteksi: <strong>{previewId}</strong>
        </p>
      )}

      <button
        className="px-4 py-2 bg-black text-white rounded"
        onClick={handleSubmit}
      >
        Create Widget
      </button>
    </div>
  );
}
