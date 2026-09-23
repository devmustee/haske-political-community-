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
    <ol className="relative flex flex-col gap-8 border-l border-border pl-6 sm:pl-8">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span className="absolute -left-[31px] top-1 flex size-3.5 items-center justify-center rounded-full border-2 border-primary bg-background sm:-left-[35px]" />
          <span className="content-status-badge border border-border bg-secondary text-secondary-foreground">
            {ERA_LABELS[item.era] ?? item.era}
          </span>
          <p className="mt-1.5 text-sm font-medium text-muted-foreground">{item.dateLabel}</p>
          <h3 className="mt-0.5 font-serif text-lg font-semibold">{item.title}</h3>
          <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{item.description}</p>
        </li>
      ))}
    </ol>
  );
}
