import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthArt } from "@/components/auth/AuthArt";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account | EnergyTrack" },
      { name: "description", content: "Create a free EnergyTrack account to calculate appliance energy use and bills." },
      { property: "og:title", content: "Create Account | EnergyTrack" },
      { property: "og:description", content: "Start tracking household energy consumption in minutes." },
    ],
  }),
  component: RegisterPage,
});

const schema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().trim().email("Enter a valid email address").max(255),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72)
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[a-z]/, "Include at least one lowercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

function RegisterPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) void navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [i.path[0] as string, i.message])));
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { name: parsed.data.name },
      },
    });
    setSubmitting(false);

    if (error) {
      const duplicate = /already registered|already exists|User already/i.test(error.message);
      toast.error(duplicate ? "An account with this email already exists" : error.message);
      return;
    }
    toast.success("Account created — welcome to EnergyTrack!");
    void navigate({ to: "/dashboard" });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthArt
        title="Start saving from your very first appliance"
        subtitle="Create an account and get a full breakdown of consumption, bills and optimization tips."
      />

      <div className="flex items-center justify-center px-5 py-10">
        <div className="glass w-full max-w-md animate-rise rounded-3xl p-7">
          <h1 className="text-2xl font-bold text-foreground">Create account</h1>
          <p className="mt-1 text-sm text-muted-foreground">It takes less than a minute.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <FiUser className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="name" className="pl-9" value={form.name} onChange={set("name")} placeholder="Asha Kumar" />
              </div>
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-9"
                  value={form.password}
                  onChange={set("password")}
                  placeholder="At least 8 characters"
                />
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirm password</Label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirm"
                  type="password"
                  className="pl-9"
                  value={form.confirm}
                  onChange={set("confirm")}
                  placeholder="Repeat password"
                />
              </div>
              {errors.confirm && <p className="text-xs text-destructive">{errors.confirm}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Creating account…" : "Register"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
