import type { Metadata } from "next";
import { PageHero } from "@/components/cms/page-hero";
import { CheckCircle2, XCircle } from "lucide-react";

export const metadata: Metadata = { title: "Community Guidelines" };

const DO = [
  "Share genuine opinions, questions and ideas about Adamawa's development",
  "Be respectful, even in disagreement",
  "Report content that violates these guidelines",
  "Clearly identify yourself as a supporter only if you choose to",
];

const DONT = [
  "Post spam, harassment, hate speech or threats of violence",
  "Impersonate any person or organization",
  "Present fabricated claims, quotes or statistics as fact",
  "Coordinate inauthentic engagement (fake accounts, vote manipulation)",
];

export default function CommunityGuidelinesPage() {
  return (
    <div>
      <PageHero eyebrow="Legal" title="Community Guidelines" description="What we expect from everyone in Haske Community." />
      <div className="mx-auto grid max-w-3xl gap-6 px-4 py-14 sm:grid-cols-2 sm:px-6">
        <div className="rounded-2xl border border-border p-6">
          <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-primary">
            <CheckCircle2 className="size-5" /> Do
          </h2>
          <ul className="mt-3 flex flex-col gap-2.5 text-sm text-muted-foreground">
            {DO.map((item) => (
              <li key={item}>&bull; {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border p-6">
          <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-destructive">
            <XCircle className="size-5" /> Don&apos;t
          </h2>
          <ul className="mt-3 flex flex-col gap-2.5 text-sm text-muted-foreground">
            {DONT.map((item) => (
              <li key={item}>&bull; {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
