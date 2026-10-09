import Image from "next/image";
import { ExternalLink, Play, Newspaper, Calendar, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import type { VideoItem, PressItem } from "@/lib/images/videos";

interface VideoSectionProps {
  videos: VideoItem[];
  press: PressItem[];
}

export function VideoSection({ videos, press }: VideoSectionProps) {
  return (
    <div className="space-y-16">
      {/* Video Features */}
      {videos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent mb-2">
                <Play className="size-3.5 fill-accent" />
                <span>Audio-Visual Archive</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Documentary Footage &amp; Keynotes
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((vid) => (
              <SpotlightCard
                key={vid.id}
                spotlightColor="gold"
                className="overflow-hidden rounded-2xl border-border/80 bg-card p-0 shadow-elevated group"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-secondary/50">
                  <Image
                    src={vid.thumbnail}
                    alt={vid.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <Badge variant="outline" className="border-white/30 bg-black/40 text-white backdrop-blur-md">
                      {vid.duration || "Documentary"}
                    </Badge>
                    <span className="font-mono text-xs sm:text-[11px] opacity-90">{vid.date}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {vid.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {vid.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs sm:text-[11px] text-muted-foreground">
                    <span>Source: {vid.source}</span>
                    <span className="font-semibold text-primary inline-flex items-center gap-1">
                      Verified Archival Record
                    </span>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      )}

      {/* Press Coverage */}
      {press.length > 0 && (
        <div className="border-t border-border/80 pt-16">
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent mb-2">
              <Newspaper className="size-3.5" />
              <span>Independent National Press</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Investigative &amp; Mainstream News Records
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Cross-referenced reporting from leading Nigerian editorial outlets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {press.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-border/70 bg-card p-5 transition-all hover:border-primary/50 hover:shadow-soft"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-bold text-primary">{item.outlet}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {item.date}
                  </span>
                </div>
                <h4 className="mt-2 font-serif text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-start justify-between gap-2">
                  <span>{item.title}</span>
                  <ExternalLink className="size-3.5 shrink-0 opacity-40 group-hover:opacity-100 mt-1" />
                </h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {item.snippet}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
