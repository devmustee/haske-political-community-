"use server";

import { requireUser } from "@/lib/session";
import { getStorageService, validateUpload } from "@/lib/services/storage";
import { rateLimit } from "@/lib/rate-limit";

export type UploadedFile = { url: string; contentType: string };

export async function uploadFile(formData: FormData, folder: string): Promise<{ ok: true; data: UploadedFile } | { ok: false; error: string }> {
  const user = await requireUser();

  const limited = rateLimit(`upload:${user.id}`, 30, 10 * 60_000);
  if (!limited.ok) return { ok: false, error: "Too many uploads. Slow down a little." };

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No file provided." };

  const validation = validateUpload(file.type, file.size);
  if (!validation.ok) return { ok: false, error: validation.error };

  const buffer = Buffer.from(await file.arrayBuffer());
  const storage = getStorageService();

  try {
    const result = await storage.upload(buffer, {
      filename: file.name,
      contentType: file.type,
      folder: `${folder}/${user.id}`,
    });
    return { ok: true, data: { url: result.url, contentType: file.type } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Upload failed." };
  }
}
