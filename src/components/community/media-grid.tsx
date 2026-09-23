import { cn } from "@/lib/utils";

interface Media {
  id: string;
  url: string;
  type: string;
  altText: string | null;
}

export function MediaGrid({ media }: { media: Media[] }) {
  if (media.length === 0) return null;

  return (
    <div
      className={cn(
        "mt-2 grid gap-0.5 overflow-hidden rounded-2xl border border-border",
        media.length === 1 && "grid-cols-1",
        media.length === 2 && "grid-cols-2",
        media.length >= 3 && "grid-cols-2 grid-rows-2"
      )}
    >
      {media.map((m, i) => (
        <div key={m.id} className={cn("relative bg-muted", media.length === 3 && i === 0 && "row-span-2")}>
          {m.type === "VIDEO" ? (
            <video src={m.url} controls className="h-full max-h-[500px] w-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.url} alt={m.altText ?? ""} className="h-full max-h-[500px] w-full object-cover" loading="lazy" />
          )}
        </div>
      ))}
    </div>
  );
}
