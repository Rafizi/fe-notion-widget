/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { mapResults } from '../lib/mapNotion';

export default function GridPreview({ token, db }: { token: string; db: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetch('/api/notion/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, db }),
    })
      .then(r => r.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        setItems(mapResults(json.results));
      })
      .catch(e => setErr(e.message));
  }, [token, db]);

  if (err) return <p className="text-red-500">{err}</p>;
  if (!items.length) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.slice(0, 9).map(it => (
        <a
          key={it.id}
          href={it.link ?? it.canvaLink ?? '#'}
          target="_blank"
          className="aspect-square bg-purple-200 rounded overflow-hidden"
          style={{
            backgroundImage: it.attachment ? `url(${it.attachment})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          title={it.name}
        />
      ))}
    </div>
  );
}
