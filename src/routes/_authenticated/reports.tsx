import { createFileRoute } from "@tanstack/react-router";
import { FiDownload, FiFileText } from "react-icons/fi";
import { toast } from "sonner";
import { useAppliances, useSettings } from "@/lib/queries";
import { buildStats, formatCurrency, formatKwh, summarize } from "@/lib/energy";
import { PanelCard, StatCard } from "@/components/common/Cards";
import { Loader, EmptyState } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Reports | EnergyTrack" },
      { name: "description", content: "Daily, weekly and monthly energy reports with PDF and CSV export." },
      { property: "og:title", content: "Reports | EnergyTrack" },
      { property: "og:description", content: "Download appliance-wise consumption and bill reports." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { data: appliances, isLoading } = useAppliances();
  const { data: settings } = useSettings();

  if (isLoading || !settings) return <Loader label="Building your reports…" />;

  const stats = buildStats(appliances ?? [], settings.tariff);
  const summary = summarize(stats, settings.tariff);

  const rows = stats.map((s) => [
    s.appliance_name,
    s.category,
    String(s.power_rating),
    String(s.daily_usage_hours),
    String(s.quantity),
    s.dailyConsumption.toFixed(2),
    (s.dailyConsumption * 7).toFixed(2),
    s.monthlyConsumption.toFixed(2),
    s.estimatedBill.toFixed(2),
  ]);
  const head = ["Appliance", "Category", "Watts", "Hrs/day", "Qty", "kWh/day", "kWh/week", "kWh/month", "Bill"];

  function exportCsv() {
    const csv = [head, ...rows].map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "energytrack-report.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  }

  async function exportPdf() {
    const [{ default: jsPDF }, autoTable] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable").then((m) => m.default),
    ]);
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("EnergyTrack — Energy Consumption Report", 14, 18);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);
    doc.text(
      `Monthly: ${summary.totalMonthly.toFixed(2)} kWh  |  Estimated bill: ${formatCurrency(summary.estimatedBill, settings!.currency)}  |  Tariff: ${settings!.tariff}/kWh`,
      14,
      31,
    );
    autoTable(doc, { head: [head], body: rows, startY: 38, styles: { fontSize: 8 } });
    doc.save("energytrack-report.pdf");
    toast.success("PDF downloaded");
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">Daily, weekly and monthly breakdowns of your consumption.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv} disabled={stats.length === 0}>
            <FiDownload className="mr-1" /> CSV
          </Button>
          <Button onClick={() => void exportPdf()} disabled={stats.length === 0}>
            <FiFileText className="mr-1" /> PDF
          </Button>
        </div>
      </div>

      {stats.length === 0 ? (
        <EmptyState title="No data to report" description="Add appliances first to generate reports." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Daily total" value={formatKwh(summary.totalDaily)} icon={<FiFileText />} />
            <StatCard label="Weekly total" value={formatKwh(summary.totalDaily * 7)} icon={<FiFileText />} tone="accent" />
            <StatCard label="Monthly total" value={formatKwh(summary.totalMonthly)} icon={<FiFileText />} tone="success" />
            <StatCard
              label="Average per appliance"
              value={formatKwh(summary.average)}
              icon={<FiFileText />}
              tone="warning"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Highest consumption"
              value={summary.highest?.appliance_name ?? "—"}
              hint={summary.highest ? formatKwh(summary.highest.monthlyConsumption) : undefined}
              icon={<FiFileText />}
              tone="warning"
            />
            <StatCard
              label="Lowest consumption"
              value={summary.lowest?.appliance_name ?? "—"}
              hint={summary.lowest ? formatKwh(summary.lowest.monthlyConsumption) : undefined}
              icon={<FiFileText />}
              tone="success"
            />
          </div>

          <PanelCard title="Detailed report" description="Appliance-wise daily, weekly and monthly figures">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {head.map((h) => (
                      <TableHead key={h} className={h === "Appliance" || h === "Category" ? "" : "text-right"}>
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r[0]}>
                      {r.map((cell, i) => (
                        <TableCell key={i} className={i > 1 ? "text-right" : ""}>
                          {i === r.length - 1 ? formatCurrency(Number(cell), settings.currency) : cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </PanelCard>
        </>
      )}
    </div>
  );
}
