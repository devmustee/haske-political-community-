import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { EventRegisterButton, ShareEventButton, EventQuestionForm } from "@/components/cms/event-interactions";
import { formatDate, formatCount, initials } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, MapPin, User as UserIcon, Users } from "lucide-react";
import { MediaGrid } from "@/components/community/media-grid";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) return {};
  return { title: event.title, description: event.description };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();

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
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Badge>{event.status}</Badge>
      <h1 className="mt-4 font-serif text-3xl font-semibold">{event.title}</h1>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><Calendar className="size-4" /> {formatDate(event.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
        <span className="flex items-center gap-1.5"><MapPin className="size-4" /> {event.venue}{event.lga ? `, ${event.lga}` : ""}</span>
        {event.speaker && <span className="flex items-center gap-1.5"><UserIcon className="size-4" /> {event.speaker}</span>}
        {event.capacity && <span className="flex items-center gap-1.5"><Users className="size-4" /> {formatCount(event._count.registrations)}/{event.capacity} registered</span>}
      </div>

      <p className="mt-6 text-lg leading-relaxed">{event.description}</p>

      {!isPast && event.registrationRequired && (
        <div className="mt-8 flex gap-3 border-t border-border pt-6">
          <EventRegisterButton eventId={event.id} initialRegistered={isRegistered} full={full} />
          <ShareEventButton />
        </div>
      )}

      {isPast && event.summary && (
        <div className="mt-8 rounded-xl border border-border bg-secondary/30 p-5">
          <h2 className="text-sm font-semibold text-muted-foreground">Event summary</h2>
          <p className="mt-1 text-[15px]">{event.summary}</p>
        </div>
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
    </article>
  );
}
