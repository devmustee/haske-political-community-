import type { Metadata } from "next";
import { PageHero } from "@/components/cms/page-hero";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 prose-sm">
        <div className="flex flex-col gap-6 text-[15px] leading-relaxed text-foreground/90">
          <p>
            Haske Community ("we", "us") is committed to protecting your privacy. This policy explains what information we
            collect, how we use it, and the choices you have.
          </p>
          <Section title="Information we collect">
            Account details you provide (name, username, email, password), profile information you choose to add (bio,
            location, avatar), content you post (posts, comments, polls, votes), citizen feedback and program applications
            you submit, and standard technical data (IP address, device/browser information) used for security and rate
            limiting.
          </Section>
          <Section title="How we use your information">
            To operate your account and the community features, to route citizen feedback and program applications to the
            right team, to keep the platform secure (rate limiting, abuse prevention), and to send you notifications you
            have opted into.
          </Section>
          <Section title="What we don't do">
            We do not sell your personal data. We do not publicly display your email address, phone number, password, or
            precise home address. Community issue reports collect LGA-level location only, never a precise address.
          </Section>
          <Section title="Your controls">
            You can edit or delete your profile information, control which notifications you receive, delete your own
            posts and comments, and request account deletion at any time by contacting us.
          </Section>
          <Section title="Data retention">
            We retain account and content data for as long as your account is active, or as needed to comply with legal
            obligations, resolve disputes, and enforce our agreements.
          </Section>
          <Section title="Contact">
            For privacy questions or to request data deletion, use the "Speak to Haske" feedback form or contact the
            campaign team through an official channel.
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
