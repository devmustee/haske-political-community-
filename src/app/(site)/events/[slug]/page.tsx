import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { EventRegisterButton, ShareEventButton, EventQuestionForm } from "@/components/cms/event-interactions";
import { DetailHeader, DetailMetaItem } from "@/components/cms/detail-header";
import { Callout } from "@/components/cms/callout";
import { formatDate, formatCount, initials } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, MapPin, User as UserIcon, Users, FileCheck } from "lucide-react";
import { MediaGrid } from "@/components/community/media-grid";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) return {};
  return { title: event.title, description: event.description };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getSession();

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      _count: { select: { registrations: true } },
      registrations: session?.user ? { where: { userId: session.user.id } } : false,
      questions: { include: { user: true }, orderBy: { createdAt: "desc" }, take: 20 },
      media: true,
    },
  });
  if (!event) notFound();

  const isRegistered = session?.user ? event.registrations.length > 0 : false;
  const full = Boolean(event.capacity && event._count.registrations >= event.capacity);
  const isPast = event.status === "COMPLETED";

  return (
    <article>
      <DetailHeader
        backHref="/events"
        backLabel="Events"
        badges={<Badge>{event.status}</Badge>}
        title={event.title}
        meta={
          <>
            <DetailMetaItem icon={Calendar}>
              {formatDate(event.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </DetailMetaItem>
            <DetailMetaItem icon={MapPin}>
              {event.venue}
              {event.lga ? `, ${event.lga}` : ""}
            </DetailMetaItem>
            {event.speaker && <DetailMetaItem icon={UserIcon}>{event.speaker}</DetailMetaItem>}
            {event.capacity && (
              <DetailMetaItem icon={Users}>
                {formatCount(event._count.registrations)}/{event.capacity} registered
              </DetailMetaItem>
            )}
          </>
        }
      />

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        {event.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.imageUrl} alt="" className="w-full rounded-2xl border border-border object-cover shadow-soft" />
        )}

        <p className={event.imageUrl ? "mt-8 text-lg leading-relaxed" : "text-lg leading-relaxed"}>{event.description}</p>

        {!isPast && event.registrationRequired && (
          <div className="mt-8 flex gap-3 border-t border-border pt-6">
            <EventRegisterButton eventId={event.id} initialRegistered={isRegistered} full={full} />
            <ShareEventButton />
          </div>
        )}

        {isPast && event.summary && (
          <Callout icon={FileCheck} label="Event summary">
            {event.summary}
          </Callout>
        )}

        {event.media.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-muted-foreground">Photos & videos</h2>
            <MediaGrid media={event.media.map((m) => ({ id: m.id, url: m.url, type: m.type, altText: m.caption }))} />
          </div>
        )}

        <div className="mt-10 border-t border-border pt-6">
          <h2 className="font-serif text-lg font-semibold">Questions</h2>
          <div className="mt-3">
            <EventQuestionForm eventId={event.id} />
          </div>
          <div className="mt-5 flex flex-col gap-4">
            {event.questions.map((q) => (
              <div key={q.id} className="flex gap-3">
                <Avatar className="size-8 shrink-0">
                  <AvatarImage src={q.user.avatarUrl ?? undefined} />
                  <AvatarFallback className="text-xs">{initials(q.user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{q.user.name}</p>
                  <p className="text-sm">{q.question}</p>
                  {q.answer && <p className="mt-1 rounded-lg bg-secondary/50 p-2 text-sm text-muted-foreground">{q.answer}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
