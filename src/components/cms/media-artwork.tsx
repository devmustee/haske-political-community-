import { Quote } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

const PORTRAIT = "/images/abdulrahman/portraits/abdulrahman-haske-official-portrait.jpg";

/**
 * Finds a quote the article attributes to Haske: a quoted passage with
 * "Haske" mentioned shortly before it (e.g. `Haske explained…: "If we…"`).
 * Returns null otherwise, so the artwork never pairs his portrait with words
 * someone else said.
 */
export function haskePullQuote(content: string): string | null {
  const re = /["“]([^"”]{24,220})["”]/g;
  for (let m = re.exec(content); m; m = re.exec(content)) {
    const before = content.slice(Math.max(0, m.index - 90), m.index);
    if (/\bhaske\b/i.test(before)) return m[1].trim().replace(/[,;:]$/, "");
  }
  return null;
}

/**
 * Branded artwork for a media item that has no image of its own: brand green
 * with a gold glow, the official portrait fading in from the right, and
 * either a pull quote attributed to Haske or the item's category and date.
 * Purely decorative (the card's text carries the content), so hidden from
 * screen readers.
 */
export function MediaArtwork({
  content,
  categoryLabel,
  date,
  size = "lg",
  className,
}: {
  content: string;
  categoryLabel: string;
  date: Date;
  size?: "lg" | "sm";
  className?: string;
}) {
  const quote = haskePullQuote(content);
  const lg = size === "lg";
  // Longer quotes get a smaller size so the whole line (usually the
  // punchline is at the end) fits instead of being cut off.
  const long = (quote?.length ?? 0) > 90;

  return (
    <div aria-hidden className={cn("relative isolate overflow-hidden bg-primary text-primary-foreground", className)}>
      {/* Depth: darker toward the bottom left, a warm gold glow top right, faint diagonal texture. */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_100%_0%,oklch(0.78_0.145_88/0.28),transparent_55%),linear-gradient(160deg,transparent_30%,oklch(0.18_0.06_152/0.85))]" />
      <div className="absolute inset-0 -z-10 opacity-[0.07] bg-[repeating-linear-gradient(135deg,currentColor_0_1px,transparent_1px_14px)]" />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={PORTRAIT}
        alt=""
        loading="lazy"
        className={cn(
          "absolute bottom-0 right-0 -z-10 h-full object-cover object-top grayscale-[15%]",
          "[mask-image:linear-gradient(to_left,black_45%,transparent_95%)]",
          lg ? "w-[62%] sm:w-[55%]" : "w-[60%]"
        )}
      />

      <div className={cn("relative flex h-full flex-col justify-between", lg ? "p-6 sm:p-9" : "p-5")}>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/40 bg-black/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent backdrop-blur-sm">
          {categoryLabel}
        </span>

        {quote ? (
          <figure className={cn(lg ? "max-w-[68%] sm:max-w-[62%]" : "max-w-[70%]")}>
            <Quote className={cn("fill-accent text-accent", lg ? "size-8 sm:size-10" : "size-6")} />
            <blockquote
              className={cn(
                "mt-3 font-serif font-semibold leading-snug text-balance text-white drop-shadow-sm",
                lg
                  ? cn("line-clamp-6 sm:line-clamp-5", long ? "text-base sm:text-xl" : "text-lg sm:text-2xl")
                  : cn("line-clamp-4", long ? "text-sm" : "text-base")
              )}
            >
              {quote}
            </blockquote>
            <figcaption className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent sm:text-[11px] sm:tracking-[0.16em]">
              Abdulrahman Bashir Haske
            </figcaption>
          </figure>
        ) : (
          <div className={cn(lg ? "max-w-[60%]" : "max-w-[65%]")}>
            <p className={cn("font-serif font-bold leading-tight text-white", lg ? "text-3xl sm:text-4xl" : "text-2xl")}>{categoryLabel}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">{formatDate(date)}</p>
          </div>
        )}

        <p className={cn("text-[10px] font-bold uppercase tracking-[0.28em] text-white/55", lg ? "max-sm:hidden" : "hidden")}>Haske · Adamawa 2027</p>
      </div>
    </div>
  );
}
