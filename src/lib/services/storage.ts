/**
 * Object storage service abstraction.
 *
 * Default provider ("local") writes uploads to /public/uploads and serves
 * them directly — this makes every upload flow (avatars, post media,
 * documents) genuinely functional in development without any external
 * account. Set STORAGE_PROVIDER=s3 plus the S3_* variables in .env to
 * switch to S3-compatible storage (AWS S3, Cloudflare R2, Backblaze B2,
 * etc.) with no call-site changes.
 */
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export interface UploadResult {
  url: string;
  key: string;
}

export interface StorageService {
  upload(file: Buffer, opts: { filename: string; contentType: string; folder: string }): Promise<UploadResult>;
  isConfigured(): boolean;
}

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const ALLOWED_DOC_TYPES = new Set(["application/pdf"]);

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100MB
export const MAX_DOC_BYTES = 20 * 1024 * 1024; // 20MB

export function validateUpload(contentType: string, size: number): { ok: true } | { ok: false; error: string } {
  if (ALLOWED_IMAGE_TYPES.has(contentType)) {
    return size <= MAX_IMAGE_BYTES ? { ok: true } : { ok: false, error: "Image exceeds 8MB limit" };
  }
  if (ALLOWED_VIDEO_TYPES.has(contentType)) {
    return size <= MAX_VIDEO_BYTES ? { ok: true } : { ok: false, error: "Video exceeds 100MB limit" };
  }
  if (ALLOWED_DOC_TYPES.has(contentType)) {
    return size <= MAX_DOC_BYTES ? { ok: true } : { ok: false, error: "Document exceeds 20MB limit" };
  }
  return { ok: false, error: `Unsupported file type: ${contentType}` };
}

class LocalStorageService implements StorageService {
  isConfigured() {
    return true;
  }

  async upload(file: Buffer, opts: { filename: string; contentType: string; folder: string }): Promise<UploadResult> {
    const ext = path.extname(opts.filename) || "";
    const key = `${opts.folder}/${randomUUID()}${ext}`;
    const destDir = path.join(process.cwd(), "public", "uploads", opts.folder);
    await mkdir(destDir, { recursive: true });
    await writeFile(path.join(process.cwd(), "public", "uploads", key), file);
    return { url: `/uploads/${key}`, key };
  }
}

class S3StorageService implements StorageService {
  private bucket = process.env.S3_BUCKET ?? "";

  isConfigured() {
    return Boolean(
      process.env.S3_BUCKET && process.env.S3_REGION && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
    );
  }

  async upload(file: Buffer, opts: { filename: string; contentType: string; folder: string }): Promise<UploadResult> {
    if (!this.isConfigured()) {
      throw new Error(
        "S3 storage is not configured. Set S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY in .env, or switch STORAGE_PROVIDER back to 'local'."
      );
    }
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const client = new S3Client({
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT || undefined,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });
    const ext = path.extname(opts.filename) || "";
    const key = `${opts.folder}/${randomUUID()}${ext}`;
    await client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: opts.contentType,
      })
    );
    const publicBase = process.env.S3_PUBLIC_URL || `https://${this.bucket}.s3.${process.env.S3_REGION}.amazonaws.com`;
    return { url: `${publicBase}/${key}`, key };
  }
}

export function getStorageService(): StorageService {
  const provider = process.env.STORAGE_PROVIDER ?? "local";
  return provider === "s3" ? new S3StorageService() : new LocalStorageService();
}
