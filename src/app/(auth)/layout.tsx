import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-between p-8 sm:p-12">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary font-serif text-base font-semibold text-primary-foreground">
            H
          </span>
          <span className="font-serif text-lg font-semibold">Haske Community</span>
        </Link>

        <div className="mx-auto w-full max-w-sm py-12">{children}</div>

        <p className="text-center text-xs text-muted-foreground sm:text-left">
          &copy; {new Date().getFullYear()} Haske Community. All rights reserved.
        </p>
      </div>

      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative flex h-full flex-col items-start justify-end gap-4 p-16">
          <p className="font-serif text-3xl font-medium leading-snug text-primary-foreground text-balance">
            &ldquo;Connect. Participate. Build Adamawa.&rdquo;
          </p>
          <p className="text-primary-foreground/70">
            Join the public conversation shaping Adamawa&apos;s future.
          </p>
        </div>
      </div>
    </div>
  );
}
