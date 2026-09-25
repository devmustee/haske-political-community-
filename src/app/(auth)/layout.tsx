import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-between p-8 sm:p-12">
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/brand/haske-logo.png"
            alt="Abdulrahman Bashir Haske"
            width={40}
            height={40}
            className="size-10 rounded-full shadow-sm ring-2 ring-primary/10 transition-all group-hover:ring-primary/25"
            priority
          />
          <span className="font-serif text-lg font-semibold tracking-tight">Haske Community</span>
        </Link>

        <div className="mx-auto w-full max-w-sm py-12">{children}</div>

        <p className="text-center text-xs text-muted-foreground sm:text-left">
          &copy; {new Date().getFullYear()} Haske Community. All rights reserved.
        </p>
      </div>

      {/* Right-side decorative panel */}
      <div className="relative hidden overflow-hidden bg-primary lg:block">
        {/* Animated gradient */}
        <div
          className="absolute inset-0 animate-gradient opacity-25"
          style={{
            background: "linear-gradient(135deg, oklch(0.20 0.06 155), oklch(0.30 0.08 155), oklch(0.25 0.10 130), oklch(0.30 0.08 155))",
            backgroundSize: "400% 400%",
          }}
        />
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute -left-32 bottom-1/3 h-96 w-96 rounded-full bg-accent/15 blur-[120px]" />
        <div className="absolute -right-32 top-1/4 h-64 w-64 rounded-full bg-primary-foreground/5 blur-[80px]" />

        <div className="relative flex h-full flex-col items-center justify-end gap-8 p-16">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-accent/15 blur-2xl" />
            <Image
              src="/brand/portrait.png"
              alt="Abdulrahman Bashir Haske"
              width={320}
              height={244}
              className="relative w-72 rounded-2xl shadow-float"
              priority
            />
          </div>
          <div className="text-center">
            <p className="font-serif text-2xl font-medium leading-snug text-primary-foreground text-balance">
              &ldquo;Connect. Participate. Build Adamawa.&rdquo;
            </p>
            <p className="mt-3 text-primary-foreground/65">
              Join the public conversation shaping Adamawa&apos;s future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
