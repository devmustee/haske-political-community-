import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/cms/page-hero";
import { Button } from "@/components/ui/button";
import { GalleryBrowser } from "@/components/gallery/gallery-browser";
import { VideoSection } from "@/components/gallery/video-section";
import { getPublishedImages } from "@/lib/images/library";
import { getPublishedVideos, PRESS_COVERAGE } from "@/lib/images/videos";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentary Photo Gallery",
  description:
    "A sourced photographic archive of Abdulrahman Bashir Haske. Every photograph is credited and linked to its source where available.",
};

export default function GalleryPage() {
  const images = getPublishedImages();

  return (
    <div className="flex flex-col">
      <PageHero
        badge="Visual Document Archive"
        title="Documentary Photo Gallery"
        description="A curated visual archive capturing Abdulrahman Bashir Haske’s journey across enterprise industrial facilities, humanitarian relief operations, grassroots civic town halls, and competitive polo tournaments."
        primaryAction={{
          label: "Media Center",
          href: "/media",
        }}
        secondaryAction={{
          label: "Career Timeline",
          href: "/timeline",
        }}
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <GalleryBrowser images={images} />
          <div className="mt-20">
            <VideoSection videos={getPublishedVideos()} press={PRESS_COVERAGE} />
          </div>
          <p className="mt-12 text-center text-xs text-muted-foreground">
            Photographs belong to their respective owners.{" "}
            <Link href="/image-credits" className="font-semibold text-primary underline-offset-2 hover:underline">
              Photography &amp; image credits
            </Link>
          </p>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="border-t border-border/80 bg-primary text-primary-foreground py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Follow the Full Journey Over Time
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/80 max-w-xl mx-auto">
            Explore our interactive chronological timeline detailing Abdulrahman Bashir Haske’s education, enterprise milestones, and civic initiatives.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="gold-shimmer" size="lg">
              <Link href="/timeline">
                Interactive Career Timeline
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/media">Press & Speeches</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
