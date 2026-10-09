"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ImageLightbox } from "@/components/community/image-lightbox";

interface Media {
  id: string;
  url: string;
  type: string;
  altText: string | null;
}

export function MediaGrid({ media }: { media: Media[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (media.length === 0) return null;

  const images = media.filter((m) => m.type !== "VIDEO");

  return (
    // Stops clicks (including those from the portalled lightbox, which bubble
    // through the React tree) from reaching an ancestor PostRowLink.
    <div onClick={(e) => e.stopPropagation()}>
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
              <button
                type="button"
                onClick={() => setOpenIndex(images.findIndex((img) => img.id === m.id))}
                className="block size-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-ring"
                aria-label={m.altText ? `View image: ${m.altText}` : "View image"}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.altText ?? ""} className="h-full max-h-[500px] w-full object-cover" loading="lazy" />
              </button>
            )}
          </div>
        ))}
      </div>

      {images.length > 0 && (
        <ImageLightbox
          images={images}
          index={openIndex}
          onIndexChange={setOpenIndex}
        />
      )}
    </div>
  );
}
