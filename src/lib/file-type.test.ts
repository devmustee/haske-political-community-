import { describe, expect, it } from "vitest";
import { sniffFileType, typeFamily } from "./file-type";

const bytes = (...parts: (number[] | string)[]) =>
  new Uint8Array(parts.flatMap((p) => (typeof p === "string" ? [...p].map((c) => c.charCodeAt(0)) : p)));

describe("sniffFileType", () => {
  it("recognises the accepted image types", () => {
    expect(sniffFileType(bytes([0xff, 0xd8, 0xff, 0xe0]))?.contentType).toBe("image/jpeg");
    expect(sniffFileType(bytes([0x89], "PNG", [0x0d, 0x0a, 0x1a, 0x0a]))?.contentType).toBe("image/png");
    expect(sniffFileType(bytes("GIF89a"))?.contentType).toBe("image/gif");
    expect(sniffFileType(bytes("RIFF", [0, 0, 0, 0], "WEBPVP8 "))?.contentType).toBe("image/webp");
  });

  it("recognises video and PDF", () => {
    expect(sniffFileType(bytes([0, 0, 0, 0x20], "ftypisom"))).toEqual({ contentType: "video/mp4", ext: ".mp4" });
    expect(sniffFileType(bytes([0, 0, 0, 0x14], "ftypqt  "))).toEqual({ contentType: "video/quicktime", ext: ".mov" });
    expect(sniffFileType(bytes([0x1a, 0x45, 0xdf, 0xa3]))?.contentType).toBe("video/webm");
    expect(sniffFileType(bytes("%PDF-1.7"))?.contentType).toBe("application/pdf");
  });

  it("rejects HTML, SVG and scripts, whatever they claim to be", () => {
    expect(sniffFileType(bytes("<!DOCTYPE html><script>alert(1)</script>"))).toBeNull();
    expect(sniffFileType(bytes('<svg xmlns="http://www.w3.org/2000/svg">'))).toBeNull();
    expect(sniffFileType(bytes("RIFF", [0, 0, 0, 0], "AVI "))).toBeNull();
    expect(sniffFileType(new Uint8Array())).toBeNull();
  });

  it("gives the type family", () => {
    expect(typeFamily("image/png")).toBe("image");
    expect(typeFamily("video/mp4")).toBe("video");
  });
});
