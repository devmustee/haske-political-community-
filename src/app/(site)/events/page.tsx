import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { formatDate } from "@/lib/utils";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Events" };
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
      <PageHero eyebrow="Follow" title="Events" description="Public events, town halls and campaign activities." watermark="Events" />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Upcoming</h2>
        {upcoming.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border p-12 text-center">
            <Calendar className="mx-auto size-10 text-muted-foreground/40" />
            <p className="mt-4 text-muted-foreground">No upcoming events scheduled yet. Check back soon.</p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            {upcoming.map((e, i) => (
              <Reveal key={e.id} delay={Math.min(i, 5) * 80}>
                <EventRow event={e} />
              </Reveal>
            ))}
          </div>
        )}

        {past.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Past events</h2>
            <div className="mt-6 flex flex-col gap-4">
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

function EventRow({ event }: { event: { id: string; slug: string; title: string; date: Date; venue: string; status: string; imageUrl?: string | null } }) {
  return (
    <Link href={`/events/${event.slug}`}>
      <Card className="group card-link overflow-hidden">
        <CardContent className="flex items-center gap-4 p-5">
          {event.imageUrl && (
            <div className="relative hidden size-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.imageUrl} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            </div>
          )}
          <div className="flex flex-1 items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={STATUS_VARIANT[event.status] ?? "outline"}>{event.status}</Badge>
              </div>
              <p className="mt-2 text-lg font-medium group-hover:text-primary transition-colors">{event.title}</p>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><Calendar className="size-4 text-primary/60" /> {formatDate(event.date)}</span>
                <span className="flex items-center gap-2"><MapPin className="size-4 text-primary/60" /> {event.venue}</span>
              </div>
            </div>
            <ArrowRight className="size-5 shrink-0 text-muted-foreground/40 transition-all group-hover:text-primary group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
