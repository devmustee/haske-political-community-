import Image from "next/image";
import { IMAGE_LIBRARY } from "@/lib/images/library";
import { cn } from "@/lib/utils";

const SIZES = new Map(IMAGE_LIBRARY.map((img) => [img.src, { width: img.width, height: img.height }]));

/**
 * Fills a card's image area. Landscape photos are cropped to fill it; portrait
 * images (news graphics, posters) are shown whole over a blurred copy of
 * themselves, because cropping them leaves only a slice of headline text.
 * Sizes come from the image library; unknown images are treated as photos.
 */
export function CardImage({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 560px, 100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  /** How wide the image is shown, so phones download a phone-sized file. */
  sizes?: string;
}) {
  const size = SIZES.get(src);
  const portrait = size ? size.height > size.width : false;
  // Site images go through the optimizer (resized, AVIF/WebP); anything else
  // (an outside URL) is shown as-is.
  const local = src.startsWith("/");

  return (
    // Portrait images get a taller frame on phones and tablets, where a
    // wide frame would shrink them to a thumbnail.
    <div className={cn("relative overflow-hidden bg-muted", className, portrait && "max-lg:aspect-[4/3]")}>
      {portrait &&
        (local ? (
          <Image src={src} alt="" aria-hidden fill sizes="200px" className="scale-110 object-cover opacity-60 blur-2xl" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" aria-hidden className="absolute inset-0 size-full scale-110 object-cover opacity-60 blur-2xl" loading="lazy" />
        ))}
      {local ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={cn(
            "transition-transform duration-700 ease-out",
            portrait ? "object-contain p-3 drop-shadow-xl group-hover:scale-[1.02]" : "object-cover group-hover:scale-105"
          )}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={cn(
            "absolute inset-0 size-full transition-transform duration-700 ease-out",
            portrait ? "object-contain p-3 drop-shadow-xl group-hover:scale-[1.02]" : "object-cover group-hover:scale-105"
          )}
        />
      )}
    </div>
  );
}
