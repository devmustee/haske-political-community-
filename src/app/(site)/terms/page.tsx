import type { Metadata } from "next";
import { PageHero } from "@/components/cms/page-hero";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div>
      <PageHero eyebrow="Legal" title="Terms of Service" />
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-6 text-[15px] leading-relaxed text-foreground/90">
          <p>
            By creating an account or using Haske Community, you agree to these terms. Please also review our Privacy
            Policy and Community Guidelines.
          </p>
          <Section title="Your account">
            You must provide accurate information and are responsible for activity on your account. You must be old enough
            to lawfully use this platform under applicable Nigerian law.
          </Section>
          <Section title="Content you post">
            You retain ownership of content you post but grant Haske Community a license to display it on the platform.
            You are responsible for ensuring your content does not violate our Community Guidelines or applicable law.
          </Section>
          <Section title="Content labeling">
            The platform distinguishes documented record, proposed agenda, community content, and third-party sources.
            User-generated content reflects the views of the individual poster, not the campaign, unless published from an
            official verified account.
          </Section>
          <Section title="Prohibited conduct">
            Do not post spam, harassment, hate speech, threats, impersonation, or fabricated claims presented as fact. We
            may remove content and suspend or ban accounts that violate these terms.
          </Section>
          <Section title="Moderation">
            We use a combination of automated filters and human moderators to review reported content. Moderation
            decisions can be appealed through the "Speak to Haske" feedback form.
          </Section>
          <Section title="Changes">
            We may update these terms from time to time. Continued use of the platform after changes constitutes
            acceptance of the updated terms.
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-lg font-semibold">{title}</h2>
      <p className="mt-1.5 text-muted-foreground">{children}</p>
    </div>
  );
}
