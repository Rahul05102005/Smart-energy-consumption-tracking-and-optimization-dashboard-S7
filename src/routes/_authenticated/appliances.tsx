import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { useAppliances, useApplianceMutations, useSettings } from "@/lib/queries";
import { buildStats, CATEGORIES, formatCurrency, type Appliance } from "@/lib/energy";
import { PanelCard } from "@/components/common/Cards";
import { Loader, EmptyState } from "@/components/common/Loader";
import { ApplianceForm } from "@/components/appliances/ApplianceForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/appliances")({
  head: () => ({
    meta: [
      { title: "Appliances | EnergyTrack" },
      { name: "description", content: "Add, edit, search and filter household appliances and their energy usage." },
      { property: "og:title", content: "Appliances | EnergyTrack" },
      { property: "og:description", content: "Full CRUD management of your appliance list." },
    ],
  }),
  component: AppliancesPage,
});

function AppliancesPage() {
  const { data: appliances, isLoading } = useAppliances();
  const { data: settings } = useSettings();
  const { create, update, remove } = useApplianceMutations();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("recent");
  const [editing, setEditing] = useState<Appliance | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const rows = useMemo(() => {
    if (!settings) return [];
    let list = buildStats(appliances ?? [], settings.tariff);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((a) => a.appliance_name.toLowerCase().includes(q));
    }
    if (category !== "all") list = list.filter((a) => a.category === category);
    if (sort === "highest") list = [...list].sort((a, b) => b.monthlyConsumption - a.monthlyConsumption);
    else if (sort === "lowest") list = [...list].sort((a, b) => a.monthlyConsumption - b.monthlyConsumption);
    else list = [...list].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    return list;
  }, [appliances, settings, search, category, sort]);

  if (isLoading || !settings) return <Loader label="Loading appliances…" />;

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appliances</h1>
          <p className="text-sm text-muted-foreground">Manage every device that draws power in your home.</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <FiPlus className="mr-1" /> Add appliance
        </Button>
      </div>

      <PanelCard title="Your appliances" description={`${rows.length} shown`}>
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search appliances…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently added</SelectItem>
              <SelectItem value="highest">Highest consumption</SelectItem>
              <SelectItem value="lowest">Lowest consumption</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {rows.length === 0 ? (
          <EmptyState title="Nothing to show" description="Add an appliance or clear your filters." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Appliance</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Watts</TableHead>
                  <TableHead className="text-right">Hrs/day</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">kWh/day</TableHead>
                  <TableHead className="text-right">kWh/month</TableHead>
                  <TableHead className="text-right">Bill</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.appliance_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{a.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{a.power_rating}</TableCell>
                    <TableCell className="text-right">{a.daily_usage_hours}</TableCell>
                    <TableCell className="text-right">{a.quantity}</TableCell>
                    <TableCell className="text-right">{a.dailyConsumption.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{a.monthlyConsumption.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(a.estimatedBill, settings.currency)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Edit ${a.appliance_name}`}
                          onClick={() => {
                            setEditing(a);
                            setFormOpen(true);
                          }}
                        >
                          <FiEdit2 />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Delete ${a.appliance_name}`}
                          onClick={() => setDeleteId(a.id)}
                        >
                          <FiTrash2 className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </PanelCard>

      <ApplianceForm
        open={formOpen}
        onOpenChange={setFormOpen}
        appliance={editing}
        saving={create.isPending || update.isPending}
        onSubmit={async (values) => {
          if (editing) {
            await update.mutateAsync({ id: editing.id, ...values });
            toast.success("Appliance updated");
          } else {
            await create.mutateAsync(values);
            toast.success("Appliance added");
          }
        }}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this appliance?</AlertDialogTitle>
            <AlertDialogDescription>This permanently removes it from your consumption data.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deleteId) return;
                try {
                  await remove.mutateAsync(deleteId);
                  toast.success("Appliance deleted");
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Delete failed");
                }
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
