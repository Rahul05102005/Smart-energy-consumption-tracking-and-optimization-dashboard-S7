import { useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { FiZap } from "react-icons/fi";
import { useAppliances, useSettings } from "@/lib/queries";
import { buildStats, formatKwh, generateRecommendations } from "@/lib/energy";
import { addNotification } from "@/lib/notifications";
import { PanelCard } from "@/components/common/Cards";
import { Loader } from "@/components/common/Loader";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/recommendations")({
  head: () => ({
    meta: [
      { title: "Recommendations | EnergyTrack" },
      { name: "description", content: "Personalised energy-saving recommendations based on your appliance usage." },
      { property: "og:title", content: "Recommendations | EnergyTrack" },
      { property: "og:description", content: "Actionable tips that adapt to how you actually use energy." },
    ],
  }),
  component: RecommendationsPage,
});

const tone = { high: "destructive", medium: "default", low: "secondary" } as const;

function RecommendationsPage() {
  const { data: appliances, isLoading } = useAppliances();
  const { data: settings } = useSettings();
  const alerted = useRef(false);

  // High-usage pop-up: shown only on this page, for 3 seconds, and saved to history.
  useEffect(() => {
    if (alerted.current || !settings || !settings.notifications || !appliances?.length) return;
    const alertStats = buildStats(appliances, settings.tariff);
    const top = [...alertStats].sort((a, b) => b.monthlyConsumption - a.monthlyConsumption)[0];
    if (!top) return;
    alerted.current = true;
    const tip =
      generateRecommendations(alertStats, settings.tariff, settings.currency).find((t) => t.priority === "high")
        ?.message ?? "Reduce its daily runtime or shift it to off-peak hours to cut consumption.";
    const title = `High usage: ${top.appliance_name}`;
    const description = `${formatKwh(top.monthlyConsumption)}/month (${top.sharePercent.toFixed(0)}% of your load). ${tip}`;
    toast.warning(title, { description, duration: 3000, closeButton: true });
    addNotification(title, description);
  }, [appliances, settings]);

  if (isLoading || !settings) return <Loader label="Analysing your usage…" />;

  const stats = buildStats(appliances ?? [], settings.tariff);
  const tips = generateRecommendations(stats, settings.tariff, settings.currency);


  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Recommendations</h1>
        <p className="text-sm text-muted-foreground">Generated automatically from your appliance data.</p>
      </div>

      <PanelCard title="Your action list" description={`${tips.length} suggestions, highest impact first`}>
        <ul className="space-y-3">
          {[...tips]
            .sort((a, b) => ["high", "medium", "low"].indexOf(a.priority) - ["high", "medium", "low"].indexOf(b.priority))
            .map((tip) => (
              <li key={tip.message} className="flex items-start gap-3 rounded-xl border border-border p-4">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-primary/12 text-primary">
                  <FiZap />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{tip.message}</p>
                  <Badge variant={tone[tip.priority]} className="mt-2 capitalize">
                    {tip.priority} priority
                  </Badge>
                </div>
              </li>
            ))}
        </ul>
      </PanelCard>
    </div>
  );
}
