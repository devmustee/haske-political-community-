import { describe, expect, it } from "vitest";
import { safeCallbackUrl } from "./safe-redirect";

describe("safeCallbackUrl", () => {
  it.each(["/community", "/programs/youth?x=1", "/admin#top"])("keeps same-site path %s", (p) => {
    expect(safeCallbackUrl(p)).toBe(p);
  });
  it.each([
    "https://evil.example",
    "//evil.example/login",
    "/\\evil.example",
    "javascript:alert(1)",
    "evil.example",
    "",
    null,
  ])("rejects %j", (p) => {
    expect(safeCallbackUrl(p as string | null)).toBe("/community");
  });
});
