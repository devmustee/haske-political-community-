"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getFeedbackStatus, getMyFeedback } from "@/lib/actions/feedback";
import { formatRelativeTime } from "@/lib/utils";

const STATUS_VARIANT: Record<string, "outline" | "secondary" | "default" | "success"> = {
  RECEIVED: "outline",
  UNDER_REVIEW: "secondary",
  ASSIGNED: "secondary",
  IN_PROGRESS: "default",
  RESOLVED: "success",
  CLOSED: "outline",
};

interface FeedbackRow {
  id: string;
  trackingId: string;
  subject: string;
  type: string;
  status: string;
  createdAt: Date;
}

export function FeedbackTracker({ isSignedIn }: { isSignedIn: boolean }) {
  const [trackingId, setTrackingId] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof getFeedbackStatus>> | null | "not-found">(null);
  const [mine, setMine] = useState<FeedbackRow[]>([]);

  useEffect(() => {
    if (isSignedIn) {
      getMyFeedback().then(setMine);
    }
  }, [isSignedIn]);

  async function handleSearch() {
    if (!trackingId.trim()) return;
    setSearching(true);
    const found = await getFeedbackStatus(trackingId);
    setSearching(false);
    if (!found) {
      setResult("not-found");
      toast.error("No submission found with that tracking ID on your account.");
      return;
    }
    setResult(found);
  }

  if (!isSignedIn) {
    return <p className="text-sm text-muted-foreground">Sign in to track the status of your submissions.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <Input
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter tracking ID e.g. HC-10452"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={searching}>
          {searching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          Track
        </Button>
      </div>

      {result && result !== "not-found" && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="font-mono font-semibold">{result.trackingId}</p>
              <Badge variant={STATUS_VARIANT[result.status]}>{result.status.replace("_", " ")}</Badge>
            </div>
            <p className="mt-2 font-medium">{result.subject}</p>
            <p className="mt-1 text-sm text-muted-foreground">{result.description}</p>
            {result.updates.length > 0 && (
              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3">
                {result.updates.map((u) => (
                  <div key={u.id} className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{u.status.replace("_", " ")}</span> &middot; {formatRelativeTime(u.createdAt)}
                    {u.note && <p className="mt-0.5">{u.note}</p>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {mine.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Your submissions</h3>
          <div className="flex flex-col gap-2">
            {mine.map((f) => (
              <Card key={f.id}>
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{f.subject}</p>
                    <p className="font-mono text-xs text-muted-foreground">{f.trackingId}</p>
                  </div>
                  <Badge variant={STATUS_VARIANT[f.status]}>{f.status.replace("_", " ")}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
