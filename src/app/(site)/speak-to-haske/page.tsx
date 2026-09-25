import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { PageHero } from "@/components/cms/page-hero";
import { FeedbackForm } from "@/components/cms/feedback-form";
import { FeedbackTracker } from "@/components/cms/feedback-tracker";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageSquare, LogIn } from "lucide-react";

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

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
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
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-border bg-gradient-to-br from-secondary/30 to-secondary/10 p-14 text-center shadow-soft">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageSquare className="size-7" />
            </div>
            <div>
              <p className="text-lg font-medium">Sign in to get started</p>
              <p className="mt-1 text-muted-foreground">Sign in to submit feedback and track its status.</p>
            </div>
            <Button asChild size="lg" className="shadow-glow-primary">
              <Link href="/login?callbackUrl=/speak-to-haske">
                <LogIn className="size-4" />
                Sign in
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
