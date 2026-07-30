import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useSaveProfile } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { PanelCard } from "@/components/common/Cards";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile | EnergyTrack" },
      { name: "description", content: "View account details, edit your profile and change your password." },
      { property: "og:title", content: "Profile | EnergyTrack" },
      { property: "og:description", content: "Manage your EnergyTrack account." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const saveProfile = useSaveProfile();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    if (profile) setName(profile.name);
  }, [profile]);

  if (isLoading) return <Loader label="Loading profile…" />;

  async function updateName(event: React.FormEvent) {
    event.preventDefault();
    const parsed = z.string().trim().min(2, "Name must be at least 2 characters").max(100).safeParse(name);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    await saveProfile.mutateAsync({ name: parsed.data });
    toast.success("Profile updated");
  }

  async function updatePassword(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return toast.error(error.message);
    setPassword("");
    setConfirm("");
    toast.success("Password changed");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Your account details and security settings.</p>
      </div>

      <PanelCard title="Account details">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium text-foreground">{profile?.email || user?.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Member since</dt>
            <dd className="font-medium text-foreground">
              {profile ? new Date(profile.created_at).toLocaleDateString() : "—"}
            </dd>
          </div>
        </dl>
      </PanelCard>

      <PanelCard title="Edit profile">
        <form className="space-y-4" onSubmit={updateName}>
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <Button type="submit" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </PanelCard>

      <PanelCard title="Change password">
        <form className="space-y-4" onSubmit={updatePassword}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit">Update password</Button>
        </form>
      </PanelCard>
    </div>
  );
}
