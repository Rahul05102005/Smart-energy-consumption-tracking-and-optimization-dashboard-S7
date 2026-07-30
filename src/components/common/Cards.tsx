import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
  tone?: "primary" | "accent" | "warning" | "success";
  className?: string;
};

const toneMap = {
  primary: "bg-primary/12 text-primary",
  accent: "bg-accent/12 text-accent",
  warning: "bg-warning/20 text-warning-foreground",
  success: "bg-success/15 text-success",
} as const;

/** Reusable KPI card used across the dashboard and reports pages. */
export function StatCard({ label, value, hint, icon, tone = "primary", className }: StatCardProps) {
  return (
    <Card className={cn("glass animate-rise rounded-2xl border-0 transition-transform hover:-translate-y-0.5", className)}>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 truncate text-2xl font-bold text-foreground">{value}</p>
          {hint ? <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl text-lg", toneMap[tone])}>{icon}</span>
      </CardContent>
    </Card>
  );
}

export function PanelCard({
  title,
  description,
  children,
  action,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("glass animate-rise rounded-2xl border-0", className)}>
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
          </div>
          {action}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
