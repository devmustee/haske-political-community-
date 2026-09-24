function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2];
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    return null;
  } catch {
    return null;
  }
}

export function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const id = extractYouTubeId(url);
  if (!id) return null;

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        className="size-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
