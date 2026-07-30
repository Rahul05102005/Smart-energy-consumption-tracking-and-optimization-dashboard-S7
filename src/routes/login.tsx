import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { FiLock, FiMail, FiZap } from "react-icons/fi";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthArt } from "@/components/auth/AuthArt";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login | EnergyTrack Energy Dashboard" },
      { name: "description", content: "Sign in to track appliance energy use, bills and savings on EnergyTrack." },
      { property: "og:title", content: "Login | EnergyTrack Energy Dashboard" },
      { property: "og:description", content: "Secure sign in to your household energy dashboard." },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) void navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("energytrack:email") : null;
    if (saved) setEmail(saved);
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [i.path[0] as string, i.message])));
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Incorrect email or password" : error.message);
      return;
    }
    if (remember) localStorage.setItem("energytrack:email", parsed.data.email);
    else localStorage.removeItem("energytrack:email");
    toast.success("Welcome back!");
    void navigate({ to: "/dashboard" });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthArt
        title="Understand every watt in your home"
        subtitle="Add appliances, get instant kWh and bill estimates, and act on personalised saving tips."
      />

      <div className="flex items-center justify-center px-5 py-10">
        <div className="glass w-full max-w-md animate-rise rounded-3xl p-7">
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <span className="gradient-primary grid size-9 place-items-center rounded-xl text-primary-foreground">
              <FiZap />
            </span>
            <span className="font-bold">EnergyTrack</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Access your energy dashboard.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  autoComplete="current-password"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Signing in…" : "Login"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
