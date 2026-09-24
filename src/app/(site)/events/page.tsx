import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Calendar, MapPin } from "lucide-react";

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
      <PageHero eyebrow="Follow" title="Events" description="Public events, town halls and campaign activities." />

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h2 className="font-serif text-xl font-semibold">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-muted-foreground">No upcoming events scheduled yet. Check back soon.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {upcoming.map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </div>
        )}

        {past.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-xl font-semibold">Past events</h2>
            <div className="mt-4 flex flex-col gap-3">
              {past.map((e) => (
                <EventRow key={e.id} event={e} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EventRow({ event }: { event: { id: string; slug: string; title: string; date: Date; venue: string; status: string } }) {
  return (
    <Link href={`/events/${event.slug}`}>
      <Card className="card-link">
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant={STATUS_VARIANT[event.status] ?? "outline"}>{event.status}</Badge>
            </div>
            <p className="mt-1.5 font-medium">{event.title}</p>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="size-3.5" /> {formatDate(event.date)}</span>
              <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {event.venue}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
