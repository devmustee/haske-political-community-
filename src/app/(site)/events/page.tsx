import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { formatDate } from "@/lib/utils";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Events & Town Halls — Haske Community",
  description: "Public events, community town halls, citizen forums, and campaign activities across Adamawa State.",
};
export const revalidate = 30;

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  UPCOMING: "default",
  ONGOING: "default",
  COMPLETED: "secondary",
  CANCELLED: "outline",
};

export default async function EventsPage() {
  const events = await prisma.event.findMany({ orderBy: { date: "desc" } });
  const upcoming = events.filter((e) => e.status === "UPCOMING" || e.status === "ONGOING");
  const past = events.filter((e) => e.status === "COMPLETED" || e.status === "CANCELLED");

  return (
    <div>
      <PageHero
        eyebrow="Civic Gatherings"
        title="Public Events & Town Halls"
        description="Participate in community engagements, campaign town halls, and constituent listening tours across the state."
        watermark="Events"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
            <Clock className="size-3.5 text-accent" /> Live Schedule
          </span>
        }
      />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 className="font-serif text-2xl font-bold sm:text-3xl text-foreground mb-6">
          Upcoming Schedule
        </h2>
        {upcoming.length === 0 ? (
          <SpotlightCard spotlightColor="gold" className="p-12 text-center border-dashed">
            <Calendar className="mx-auto size-12 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No upcoming events scheduled right now. Check back soon or follow the community feed.</p>
          </SpotlightCard>
        ) : (
          <div className="flex flex-col gap-4">
            {upcoming.map((e, i) => (
              <Reveal key={e.id} delay={Math.min(i, 5) * 80}>
                <EventRow event={e} isUpcoming />
              </Reveal>
            ))}
          </div>
        )}

        {past.length > 0 && (
          <div className="mt-20">
            <h2 className="font-serif text-2xl font-bold sm:text-3xl text-foreground mb-6">
              Past Gatherings Archive
            </h2>
            <div className="flex flex-col gap-4">
              {past.map((e, i) => (
                <Reveal key={e.id} delay={Math.min(i, 5) * 80}>
                  <EventRow event={e} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EventRow({
  event,
  isUpcoming = false,
}: {
  event: {
    id: string;
    slug: string;
    title: string;
    date: Date;
    venue: string;
    status: string;
    imageUrl?: string | null;
  };
  isUpcoming?: boolean;
}) {
  return (
    <Link href={`/events/${event.slug}`}>
      <SpotlightCard
        spotlightColor={isUpcoming ? "gold" : "primary"}
        className="p-5 sm:p-6 shadow-ambient"
      >
        <div className="flex items-center gap-5">
          {event.imageUrl && (
            <div className="relative hidden size-24 shrink-0 overflow-hidden rounded-2xl bg-muted sm:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.imageUrl}
                alt=""
                className="size-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
          )}
          <div className="flex flex-1 items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={STATUS_VARIANT[event.status] ?? "outline"}
                  className="font-bold text-xs"
                >
                  {event.status}
                </Badge>
              </div>
              <h3 className="mt-2 text-lg sm:text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                {event.title}
              </h3>
              <div className="mt-2.5 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="size-3.5 text-primary" /> {formatDate(event.date)}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="size-3.5 text-primary" /> {event.venue}
                </span>
              </div>
            </div>
            <ArrowRight className="size-5 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </div>
        </div>
      </SpotlightCard>
    </Link>
  );
}
