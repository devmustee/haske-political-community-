import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { PolicyPillarFormDialog } from "@/components/admin/policy-pillar-form-dialog";
import { PublishManifestoDialog } from "@/components/admin/publish-manifesto-dialog";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Manifesto & Policy" };
export const dynamic = "force-dynamic";

export default async function AdminManifestoPage() {
  const [pillars, manifestos] = await Promise.all([
    prisma.policyPillar.findMany({ orderBy: { order: "asc" } }),
    prisma.manifesto.findMany({ orderBy: { publicationDate: "desc" } }),
  ]);

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Manifesto &amp; Policy</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage policy pillars and publish manifesto versions.</p>
        </div>
        <PublishManifestoDialog pillars={pillars.map((p) => ({ id: p.id, name: p.name }))} />
      </div>

      <h2 className="mt-8 text-sm font-semibold text-muted-foreground">Policy pillars</h2>
      <div className="mt-3 flex flex-col gap-2">
        {pillars.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{p.category}</Badge>
                <ContentStatusBadge status={p.contentStatus} />
              </div>
              <p className="mt-1 font-medium">{p.name}</p>
            </div>
            <PolicyPillarFormDialog pillar={p} />
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-sm font-semibold text-muted-foreground">Manifesto versions</h2>
      <div className="mt-3 flex flex-col gap-2">
        {manifestos.map((m) => (
          <div key={m.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-4">
            <div>
              <p className="font-medium">{m.title}</p>
              <p className="text-xs text-muted-foreground">v{m.version} &middot; Published {formatDate(m.publicationDate)}</p>
            </div>
            {m.isCurrent ? <Badge>Current</Badge> : <Badge variant="outline">Historical</Badge>}
          </div>
        ))}
      </div>
    </div>
  );
}
