import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSaveSettings, useSettings } from "@/lib/queries";
import { CURRENCIES } from "@/lib/energy";
import { PanelCard } from "@/components/common/Cards";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings | EnergyTrack" },
      { name: "description", content: "Configure currency, electricity tariff, dark mode and notifications." },
      { property: "og:title", content: "Settings | EnergyTrack" },
      { property: "og:description", content: "Personalise how EnergyTrack calculates and displays your data." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const save = useSaveSettings();
  const [tariff, setTariff] = useState("");

  useEffect(() => {
    if (settings) setTariff(String(settings.tariff));
  }, [settings]);

  if (isLoading || !settings) return <Loader label="Loading settings…" />;

  async function persist(patch: Record<string, unknown>) {
    await save.mutateAsync(patch);
    toast.success("Settings saved");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Tariff and preferences used across every calculation.</p>
      </div>

      <PanelCard title="Billing" description="Used for all bill estimates">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Currency</Label>
            <Select value={settings.currency} onValueChange={(v) => void persist({ currency: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CURRENCIES).map(([code, symbol]) => (
                  <SelectItem key={code} value={code}>
                    {code} ({symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tariff">Electricity tariff (per kWh)</Label>
            <div className="flex gap-2">
              <Input
                id="tariff"
                type="number"
                min={0}
                step="0.01"
                value={tariff}
                onChange={(e) => setTariff(e.target.value)}
              />
              <Button
                onClick={() => {
                  const value = Number(tariff);
                  if (!Number.isFinite(value) || value < 0) return toast.error("Tariff must be a positive number");
                  void persist({ tariff: value });
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </PanelCard>

      <PanelCard title="Preferences">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Dark mode</p>
              <p className="text-xs text-muted-foreground">Switch the dashboard to a dark theme.</p>
            </div>
            <Switch checked={settings.dark_mode} onCheckedChange={(v) => void persist({ dark_mode: v })} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Notifications</p>
              <p className="text-xs text-muted-foreground">Receive energy-saving alerts and monthly summaries.</p>
            </div>
            <Switch checked={settings.notifications} onCheckedChange={(v) => void persist({ notifications: v })} />
          </div>
        </div>
      </PanelCard>
    </div>
  );
}
