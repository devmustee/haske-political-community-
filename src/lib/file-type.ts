/**
 * Works out a file's real type from its first bytes ("magic numbers"), so an
 * upload is stored by what it is rather than by the name and type the
 * browser claims. Covers only the types uploads accept.
 */
export type SniffedType = {
  contentType: "image/jpeg" | "image/png" | "image/gif" | "image/webp" | "video/mp4" | "video/quicktime" | "video/webm" | "application/pdf";
  ext: string;
};

function startsWith(bytes: Uint8Array, signature: number[], offset = 0) {
  return bytes.length >= offset + signature.length && signature.every((b, i) => bytes[offset + i] === b);
}

const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));

export function sniffFileType(bytes: Uint8Array): SniffedType | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return { contentType: "image/jpeg", ext: ".jpg" };
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return { contentType: "image/png", ext: ".png" };
  if (startsWith(bytes, ascii("GIF87a")) || startsWith(bytes, ascii("GIF89a"))) return { contentType: "image/gif", ext: ".gif" };
  if (startsWith(bytes, ascii("RIFF")) && startsWith(bytes, ascii("WEBP"), 8)) return { contentType: "image/webp", ext: ".webp" };
  if (startsWith(bytes, ascii("%PDF-"))) return { contentType: "application/pdf", ext: ".pdf" };
  if (startsWith(bytes, [0x1a, 0x45, 0xdf, 0xa3])) return { contentType: "video/webm", ext: ".webm" };
  if (startsWith(bytes, ascii("ftyp"), 4)) {
    return startsWith(bytes, ascii("qt  "), 8) ? { contentType: "video/quicktime", ext: ".mov" } : { contentType: "video/mp4", ext: ".mp4" };
  }
  return null;
}

/** "image", "video" or "application": the part before the slash. */
export function typeFamily(contentType: string) {
  return contentType.split("/")[0];
}
