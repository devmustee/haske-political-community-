import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteSettingEditor } from "@/components/admin/site-setting-editor";

export const metadata: Metadata = { title: "Admin · Site Settings" };
export const dynamic = "force-dynamic";

const EDITABLE_KEYS = ["biography", "experience", "mission", "vision"];

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSetting.findMany({ where: { key: { in: EDITABLE_KEYS } } });
  const byKey = new Map(settings.map((s) => [s.key, s.value]));

  return (
    <div className="p-6 sm:p-8">
      <h1 className="font-serif text-2xl font-semibold">Site Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Edit homepage-facing copy as structured JSON. Changes apply immediately to the public site.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {EDITABLE_KEYS.map((key) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-base capitalize">{key}</CardTitle>
            </CardHeader>
            <CardContent>
              <SiteSettingEditor settingKey={key} value={byKey.get(key) ?? {}} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
