import { Reveal } from "@/components/motion/reveal";

const ERA_LABELS: Record<string, string> = {
  EARLY_LIFE: "Early Life",
  EDUCATION: "Education",
  PROFESSIONAL_CAREER: "Professional Career",
  AGRICULTURE: "Agriculture",
  COMMUNITY_DEVELOPMENT: "Community Development",
  POLITICAL_JOURNEY: "Political Journey",
};

interface TimelineItem {
  id: string;
  era: string;
  title: string;
  dateLabel: string;
  description: string;
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative flex flex-col gap-10 border-l-2 border-primary/20 pl-8 sm:pl-10">
      {items.map((item, i) => (
        <Reveal key={item.id} as="li" delay={Math.min(i, 5) * 100} className="group relative">
          {/* Dot with ring effect */}
          <span className="absolute -left-[37px] top-1 flex size-4 items-center justify-center rounded-full border-[2.5px] border-primary bg-background shadow-sm transition-all duration-300 group-hover:scale-125 group-hover:shadow-glow-primary sm:-left-[41px]" />
          {/* Era badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground shadow-sm">
            {ERA_LABELS[item.era] ?? item.era}
          </span>
          <p className="mt-2 text-sm font-medium text-primary">{item.dateLabel}</p>
          <h3 className="mt-1 font-serif text-xl font-semibold">{item.title}</h3>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{item.description}</p>
        </Reveal>
      ))}
    </ol>
  );
}
