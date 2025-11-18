/* eslint-disable @typescript-eslint/no-explicit-any */
/* SERVER COMPONENT */
import ClientEmbed from "./client-embed";
import { getToken } from "@/app/api/embed/route";
import { queryDatabase } from "@/app/lib/notion-server";

export default async function EmbedPage({ params, searchParams }: any) {
  const id = params.id;
  const db = searchParams?.db;

  if (!db)
    return <p style={{ color: "red" }}>Missing database ID.</p>;

  const token = await getToken(id);
  if (!token)
    return <p style={{ color: "red" }}>Invalid or expired embed link.</p>;

  const initialData = await queryDatabase(token, db);

  return <ClientEmbed initialData={initialData} id={id} db={db} />;
}
