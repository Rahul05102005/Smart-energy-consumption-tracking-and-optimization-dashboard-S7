import { createFileRoute } from "@tanstack/react-router";
import { FiZap } from "react-icons/fi";
import { useAppliances, useSettings } from "@/lib/queries";
import { buildStats, generateRecommendations } from "@/lib/energy";
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
