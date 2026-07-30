import { cn } from "@/lib/utils";

/** Full-panel loading indicator. */
export function Loader({ label = "Loading…", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex min-h-40 w-full flex-col items-center justify-center gap-3", className)}>
      <span className="size-8 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-10 text-center">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
