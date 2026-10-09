import type { Metadata } from "next";
import { getPublishedImages } from "@/lib/images/library";

export const metadata: Metadata = {
  title: "Photography & Image Credits",
  description: "Sources, licences and credits for photographs published on this website.",
};

export default function ImageCreditsPage() {
  const images = getPublishedImages();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="font-serif text-3xl font-bold tracking-tight">Photography &amp; Image Credits</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Photographs on this website belong to their respective owners and are published with permission or under the
        licences shown below. We do not claim ownership of third-party photographs. Only photographs whose subject,
        source and reuse rights have been checked are published. If you believe a credit is wrong or an image should
        be removed, please contact us.
      </p>

      {images.length === 0 ? (
        <p className="mt-10 rounded-lg border border-border/70 bg-secondary/40 p-6 text-sm text-muted-foreground">
          No third-party photographs are currently published. Credits will be listed here as the archive grows.
        </p>
      ) : (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="py-2 pr-4 font-semibold">Photograph</th>
                <th className="py-2 pr-4 font-semibold">Credit</th>
                <th className="py-2 pr-4 font-semibold">Licence</th>
                <th className="py-2 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              {images.map((img) => (
                <tr key={img.id} className="border-b border-border/60 align-top">
                  <td className="py-3 pr-4">
                    {img.title}
                    {img.date && <span className="text-muted-foreground"> ({img.date})</span>}
                  </td>
                  <td className="py-3 pr-4">{img.credit}</td>
                  <td className="py-3 pr-4">
                    {img.licenseUrl ? (
                      <a href={img.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline max-sm:inline-flex max-sm:items-center max-sm:min-h-11">
                        {img.license}
                      </a>
                    ) : (
                      img.license
                    )}
                  </td>
                  <td className="py-3">
                    {img.sourceUrl ? (
                      <a href={img.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline max-sm:inline-flex max-sm:items-center max-sm:min-h-11">
                        {img.source}
                      </a>
                    ) : (
                      img.source
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
