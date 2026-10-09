"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Camera, ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, type ImageCategory, type LibraryImage } from "@/lib/images/library";

export function GalleryBrowser({ images }: { images: LibraryImage[] }) {
  const [active, setActive] = useState<ImageCategory | "all">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(images.map((i) => i.category))),
    [images]
  );
  const visible = useMemo(
    () => (active === "all" ? images : images.filter((i) => i.category === active)),
    [images, active]
  );

  const step = useCallback(
    (dir: 1 | -1) =>
      setOpenIndex((i) => (i === null ? i : (i + dir + visible.length) % visible.length)),
    [visible.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, step]);

  if (images.length === 0) {
    return (
      <EmptyState
        icon={Camera}
        title="The photographic archive is being compiled"
        description="Only photographs with confirmed subjects, sources and reuse rights are published here. Check back soon."
        className="py-24"
      />
    );
  }

  const current = openIndex === null ? null : visible[openIndex];

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Gallery categories">
        {(["all", ...categories] as const).map((key) => (
          <button
            key={key}
            role="tab"
            aria-selected={active === key}
            onClick={() => setActive(key)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 max-sm:min-h-11",
              active === key
                ? "bg-primary text-primary-foreground shadow-soft"
                : "border border-border/70 bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            {key === "all" ? "All" : CATEGORY_LABELS[key]}
          </button>
        ))}
      </div>

      <ul className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>li]:mb-6">
        {visible.map((img, i) => (
          <li key={img.id} className="break-inside-avoid">
            <figure className="group">
              <button
                onClick={() => setOpenIndex(i)}
                className="relative block w-full overflow-hidden rounded-sm bg-secondary/50"
                aria-label={`Open photograph: ${img.title}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  placeholder={img.blurDataURL ? "blur" : "empty"}
                  blurDataURL={img.blurDataURL}
                  loading="lazy"
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </button>
              <figcaption className="mt-3 border-l-2 border-accent pl-3">
                <p className="text-xs font-semibold text-foreground">{img.caption}</p>
                <p className="mt-1 text-xs sm:text-[11px] text-muted-foreground">
                  {[img.date, img.location].filter(Boolean).join(" · ")}
                  {(img.date || img.location) && " — "}
                  {img.credit}
                </p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <DialogPrimitive.Root open={current !== null} onOpenChange={(o) => !o && setOpenIndex(null)}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/90" />
          <DialogPrimitive.Content
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 p-4 pb-safe pt-safe outline-none sm:gap-4 sm:p-8"
            aria-describedby={undefined}
          >
            {current && (
              <>
                <DialogPrimitive.Title className="sr-only">{current.title}</DialogPrimitive.Title>
                <Image
                  src={current.src}
                  alt={current.alt}
                  width={current.width}
                  height={current.height}
                  sizes="100vw"
                  className="max-h-[50dvh] sm:max-h-[72dvh] w-auto max-w-full object-contain select-none"
                />
                <div className="max-w-2xl text-center text-white px-2">
                  <p className="text-xs sm:text-sm font-semibold">{current.caption}</p>
                  <p className="mt-1 text-xs sm:text-xs text-white/70">
                    {[current.date, current.location].filter(Boolean).join(" · ")}
                    {(current.date || current.location) && " — "}
                    {current.credit}
                    {current.sourceUrl && (
                      <>
                        {" · "}
                        <a
                          href={current.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 underline underline-offset-2"
                        >
                          View source <ExternalLink className="size-3" />
                        </a>
                      </>
                    )}
                  </p>
                </div>
                {visible.length > 1 && (
                  <>
                    <button
                      onClick={() => step(-1)}
                      aria-label="Previous photograph"
                      className="absolute left-2 top-1/2 -translate-y-1/2 flex size-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all sm:left-6"
                    >
                      <ChevronLeft className="size-6" />
                    </button>
                    <button
                      onClick={() => step(1)}
                      aria-label="Next photograph"
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex size-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all sm:right-6"
                    >
                      <ChevronRight className="size-6" />
                    </button>
                  </>
                )}
                <DialogPrimitive.Close
                  aria-label="Close"
                  className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all"
                >
                  <X className="size-5" />
                </DialogPrimitive.Close>
              </>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
