"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { safeCallbackUrl } from "@/lib/safe-redirect";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setLoading(true);
    const res = await signIn("credentials", { ...values, redirect: false });
    setLoading(false);

    if (!res || res.error) {
      toast.error("Invalid email/username or password.");
      return;
    }
    router.push(safeCallbackUrl(searchParams.get("callbackUrl")));
    router.refresh();
  }

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="identifier">Email or username</Label>
        <Input id="identifier" autoComplete="username" placeholder="you@example.com" {...register("identifier")} />
        {errors.identifier && <p className="text-xs text-destructive">{errors.identifier.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-xs text-primary hover:underline max-sm:inline-flex max-sm:items-center max-sm:min-h-11">
            Forgot password?
          </Link>
        </div>
        <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <Button type="submit" disabled={loading} className="mt-2">
        {loading && <Loader2 className="size-4 animate-spin" />}
        Sign in
      </Button>
    </form>
  );
}
