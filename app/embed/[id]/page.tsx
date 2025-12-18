export const dynamic = "force-dynamic";

import ClientViewComponent from "@/app/components/ClientViewComponent";
import { queryDatabase } from "@/app/lib/notion-server";

interface EmbedPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function EmbedPage({ searchParams }: EmbedPageProps) {
  try {
    const dbID =
      typeof searchParams?.db === "string"
        ? decodeURIComponent(searchParams.db)
        : null;

    if (!dbID) {
      return <p style={{ color: "red" }}>Database ID missing.</p>;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/widgets/embed/by-db/${dbID}`,
      { cache: "no-store" }
    );

    console.log("searchParams:", searchParams);


    const json = await res.json();

    if (!json.success) {
      return <p style={{ color: "red" }}>Invalid widget.</p>;
    }

    const { token, profile } = json.data;

    const notionData = await queryDatabase(token, dbID);

    return (
      <ClientViewComponent
        filtered={notionData}
        profile={profile}
        theme="light"
      />
    );
  } catch (err: any) {
    console.error("EMBED ERROR:", err);
    return <p style={{ color: "red" }}>{err.message}</p>;
  }
}
