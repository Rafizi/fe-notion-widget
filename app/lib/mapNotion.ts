/* eslint-disable @typescript-eslint/no-explicit-any */
export function mapResults(results: any[]) {
  return results.map((page: any) => {
    const p = page.properties || {};
    const first = (a?: any[]) => a?.[0];
    return {
      id: page.id,
      name: first(p["Name"]?.title)?.plain_text ?? "Untitled",
      publishDate: p["Publish Date"]?.date?.start ?? null,
      attachment:
        first(p["Attachment"]?.files)?.file?.url ??
        first(p["Attachment"]?.files)?.external?.url ??
        null,
      imageSource: p["Image Source"]?.select?.name ?? null,
      link: first(p["Link"]?.rich_text)?.plain_text ?? null,
      canvaLink: p["Canva Link"]?.url ?? null,
    };
  });
}
