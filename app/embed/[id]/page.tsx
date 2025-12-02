/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "@/app/api/embed/route";
import ClientViewComponent from "@/app/components/ClientViewComponent";
import { queryDatabase } from "@/app/lib/notion-server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function EmbedPage(props: any) {
  try {
    const params = await props.params;
    const search = await props.searchParams;

    const id = params.id;        // widget id
    const db = search?.db;       // notion database id

    if (!db) return <p style={{ color: "red" }}>Database ID missing.</p>;

    // 1️⃣ GET TOKEN FROM SUPABASE
    const token = await getToken(id);
    if (!token) return <p style={{ color: "red" }}>Invalid widget.</p>;

    // 2️⃣ LOAD NOTION DATABASE
    let filtered = (await queryDatabase(token, db)).filter(
      (item: any) => item.properties?.Hide?.checkbox !== true
    );

    // --- FILTERS ---
    const decode = (v: string) => decodeURIComponent(v).replace(/\+/g, " ");
    const statusFilter = search?.status ? decode(search.status) : null;
    const platformFilter = search?.platform ? decode(search.platform) : null;
    const pillarFilter = search?.pillar ? decode(search.pillar) : null;
    const pinnedFilter = search?.pinned;

    if (statusFilter) {
      filtered = filtered.filter((item: any) => {
        const s =
          item.properties?.Status?.status?.name ||
          item.properties?.Status?.select?.name ||
          item.properties?.Status?.multi_select?.[0]?.name;
        return s?.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    if (platformFilter) {
      filtered = filtered.filter(
        (i: any) =>
          i.properties?.Platform?.select?.name?.toLowerCase() ===
          platformFilter.toLowerCase()
      );
    }

    if (pillarFilter) {
      filtered = filtered.filter(
        (i: any) =>
          i.properties?.["Content Pillar"]?.select?.name?.toLowerCase() ===
          pillarFilter.toLowerCase()
      );
    }

    if (pinnedFilter === "true")
      filtered = filtered.filter((i: any) => i.properties?.Pinned?.checkbox);
    if (pinnedFilter === "false")
      filtered = filtered.filter((i: any) => !i.properties?.Pinned?.checkbox);

    // Sort pinned first
    filtered = filtered.sort((a: any, b: any) => {
      return (b.properties?.Pinned?.checkbox ? 1 : 0) -
             (a.properties?.Pinned?.checkbox ? 1 : 0);
    });

    // ------------------------------------------------------
    // 3️⃣ LOAD PROFILE CREATOR FROM SUPABASE
    // ------------------------------------------------------
    const supabase = createServerComponentClient({ cookies });

    const { data: widget } = await supabase
      .from("widgets")
      .select("user_id")
      .eq("id", id)
      .single();

    let profile = undefined;

    if (widget?.user_id) {
      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", widget.user_id)
        .single();

      profile = p
        ? {
            name: p.name,
            username: p.username,
            avatarUrl: p.avatar_url,
            bio: p.bio,
            highlights: Array.isArray(p.highlights) ? p.highlights : [],
          }
        : undefined;
    }

    return <ClientViewComponent filtered={filtered} profile={profile} />;
  } catch (err: any) {
    return <p style={{ color: "red" }}>{err.message}</p>;
  }
}
