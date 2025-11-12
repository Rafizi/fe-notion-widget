/* eslint-disable react/jsx-no-undef */
'use client';
import { useState } from 'react';
import GridPreview from '@/app/components/GridPreview';
import NotionConnectForm from '@/app/components/NotionConnectForm';

export default function CreateWidgetPage() {
  const [token, setToken] = useState<string | null>(null);
  const [db, setDb] = useState<string | null>(null);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Content Preview Widget</h1>
      {!token || !db ? (
        <NotionConnectForm onReady={({ token, db }) => { setToken(token); setDb(db); }} />
      ) : (
        <GridPreview token={token} db={db} />
      )}
    </div>
  );
}
