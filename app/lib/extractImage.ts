/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// generate thumbnail video
export async function generateVideoThumbnail(url: string): Promise<string | null> {
  try {
    const video = document.createElement("video");
    video.src = url;
    video.crossOrigin = "anonymous";

    await new Promise((resolve) => {
      video.addEventListener("loadeddata", resolve, { once: true });
    });

    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 270;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/png");
  } catch (e) {
    console.warn("Thumbnail generation failed:", e);
    return null;
  }
}

export async function extractImage(item: any) {
  const props = item.properties;

  const isVideoUrl = (url: string) => /\.(mp4|mov|avi|webm|mkv)(\?|$)/i.test(url);

  // attachment
  if (props.Attachment?.files?.length > 0) {
    const file = props.Attachment.files[0];
    const url = file.file?.url || file.external?.url;

    if (url?.includes("canva.com")) return "/canva-placeholder.png";

    if (url && isVideoUrl(url)) {
      const thumb = await generateVideoThumbnail(url);
      return thumb || "/video-placeholder.png";
    }

    return url;
  }

  // *Link
  const linkText = props["*Link"]?.rich_text?.[0]?.plain_text;
  if (linkText) {
    if (linkText.includes("canva.com")) return "/canva-placeholder.png";

    if (isVideoUrl(linkText)) {
      const thumb = await generateVideoThumbnail(linkText);
      return thumb || "/video-placeholder.png";
    }

    return linkText;
  }

  // *Canva Link
  const canvaUrl = props["*Canva Link"]?.url;
  if (canvaUrl) {
    if (canvaUrl.includes("canva.com")) return "/canva-placeholder.png";

    if (isVideoUrl(canvaUrl)) {
      const thumb = await generateVideoThumbnail(canvaUrl);
      return thumb || "/video-placeholder.png";
    }

    return canvaUrl;
  }

  return "/placeholder.png";
}
