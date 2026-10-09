"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LightboxImage {
  id: string;
  url: string;
  altText: string | null;
}

/** Full-screen image viewer. `index === null` means closed. */
export function ImageLightbox({
  images,
  index,
  onIndexChange,
}: {
  images: LightboxImage[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
}) {
  const open = index !== null && index >= 0;
  const current = open ? images[index] : null;
  const multiple = images.length > 1;

  const go = (delta: number) => {
    if (index === null) return;
    onIndexChange((index + delta + images.length) % images.length);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onIndexChange(null)}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/90 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex items-center justify-center outline-none"
          onKeyDown={(e) => {
            if (!multiple) return;
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
          // Clicking the empty area around the image closes the viewer.
          onClick={(e) => {
            if (e.target === e.currentTarget) onIndexChange(null);
          }}
        >
          <DialogPrimitive.Title className="sr-only">
            {current?.altText || "Image"} {multiple && index !== null ? `(${index + 1} of ${images.length})` : ""}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">Full-size image viewer</DialogPrimitive.Description>

          {current && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.url}
              alt={current.altText ?? ""}
              className="max-h-[90vh] max-w-[95vw] select-none object-contain"
            />
          )}

          <div className="absolute right-3 top-3 flex items-center gap-2">
            {current && (
              <a
                href={current.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className={controlClass}
                aria-label="Download image"
              >
                <Download className="size-5" />
              </a>
            )}
            <DialogPrimitive.Close className={controlClass} aria-label="Close">
              <X className="size-5" />
            </DialogPrimitive.Close>
          </div>

          {multiple && (
            <>
              <button type="button" onClick={() => go(-1)} className={cn(controlClass, "absolute left-3 top-1/2 -translate-y-1/2")} aria-label="Previous image">
                <ChevronLeft className="size-6" />
              </button>
              <button type="button" onClick={() => go(1)} className={cn(controlClass, "absolute right-3 top-1/2 -translate-y-1/2")} aria-label="Next image">
                <ChevronRight className="size-6" />
              </button>
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                {(index ?? 0) + 1} / {images.length}
              </p>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

const controlClass =
  "flex size-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-white";
