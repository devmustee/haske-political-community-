import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { verifyEmailToken } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Verify your email" };

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = token ? await verifyEmailToken(token) : { ok: false as const, error: "Missing verification token." };

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {result.ok ? (
        <>
          <CheckCircle2 className="size-10 text-primary" />
          <h1 className="font-serif text-2xl font-semibold">Email verified</h1>
          <p className="text-sm text-muted-foreground">Your email address has been confirmed. Thanks for verifying.</p>
        </>
      ) : (
        <>
          <XCircle className="size-10 text-destructive" />
          <h1 className="font-serif text-2xl font-semibold">Verification failed</h1>
          <p className="text-sm text-muted-foreground">{result.error}</p>
        </>
      )}
      <Button asChild className="mt-2">
        <Link href="/community">Continue to Haske Community</Link>
      </Button>
    </div>
  );
}
