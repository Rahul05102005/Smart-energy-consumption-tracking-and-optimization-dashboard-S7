import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set New Password | EnergyTrack" },
      { name: "description", content: "Choose a new password for your EnergyTrack account." },
      { property: "og:title", content: "Set New Password | EnergyTrack" },
      { property: "og:description", content: "Complete your password reset securely." },
    ],
  }),
  component: ResetPasswordPage,
});

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "Passwords do not match", path: ["confirm"] });

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse({ password, confirm });
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [i.path[0] as string, i.message])));
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    void navigate({ to: "/dashboard" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="glass w-full max-w-md animate-rise rounded-3xl p-7">
        <h1 className="text-2xl font-bold text-foreground">Set a new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">Choose a strong password you haven't used before.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="password">New password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            {errors.confirm && <p className="text-xs text-destructive">{errors.confirm}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Updating…" : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
