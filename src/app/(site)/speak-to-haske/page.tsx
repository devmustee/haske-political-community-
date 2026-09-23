import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { PageHero } from "@/components/cms/page-hero";
import { FeedbackForm } from "@/components/cms/feedback-form";
import { FeedbackTracker } from "@/components/cms/feedback-tracker";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Speak to Haske", description: "Share an idea, problem, suggestion or question directly." };

export default async function SpeakToHaskePage() {
  const session = await auth();

  return (
    <div>
      <PageHero
        eyebrow="Engage"
        title="Speak to Haske"
        description="Share an idea, report a community problem, ask a question, or give feedback on a program or policy. Every submission gets a tracking ID."
      />

      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        {session?.user ? (
          <Tabs defaultValue="submit">
            <TabsList>
              <TabsTrigger value="submit">Submit</TabsTrigger>
              <TabsTrigger value="track">Track status</TabsTrigger>
            </TabsList>
            <TabsContent value="submit">
              <FeedbackForm />
            </TabsContent>
            <TabsContent value="track">
              <FeedbackTracker isSignedIn />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="text-muted-foreground">Sign in to submit feedback and track its status.</p>
            <Button asChild>
              <Link href="/login?callbackUrl=/speak-to-haske">Sign in</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
