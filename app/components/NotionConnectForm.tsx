'use client';
import { useState } from 'react';

export default function NotionConnectForm({ onReady }: { onReady: (p: { token: string; db: string }) => void }) {
  const [token, setToken] = useState('');
  const [db, setDb] = useState('');

  return (
    <div className="space-y-3">
      <input className="border p-2 w-full rounded" placeholder="Internal Integration Secret (ntn_...)" value={token} onChange={e => setToken(e.target.value)} />
      <input className="border p-2 w-full rounded" placeholder="Notion Database ID" value={db} onChange={e => setDb(e.target.value)} />
      <button className="px-4 py-2 bg-black text-white rounded" onClick={() => onReady({ token, db })}>Create Widget</button>
    </div>
  );
}
