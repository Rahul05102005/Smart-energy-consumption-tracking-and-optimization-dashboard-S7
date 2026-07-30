import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
);

/** Reads a design-system token so charts never hardcode colors. */
function token(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export function chartPalette() {
  return [
    token("--chart-1", "#10b981"),
    token("--chart-2", "#3b82f6"),
    token("--chart-3", "#f59e0b"),
    token("--chart-4", "#06b6d4"),
    token("--chart-5", "#a855f7"),
  ];
}

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
} as const;

const legendOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "bottom" as const, labels: { boxWidth: 12, usePointStyle: true } } },
} as const;

export function ApplianceBarChart({ labels, values }: { labels: string[]; values: number[] }) {
  const palette = chartPalette();
  return (
    <Bar
      options={baseOptions}
      data={{
        labels,
        datasets: [
          {
            label: "kWh / month",
            data: values,
            backgroundColor: labels.map((_, i) => palette[i % palette.length]),
            borderRadius: 8,
            maxBarThickness: 44,
          },
        ],
      }}
    />
  );
}

export function CategoryPieChart({ labels, values }: { labels: string[]; values: number[] }) {
  const palette = chartPalette();
  return (
    <Pie
      options={legendOptions}
      data={{
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: labels.map((_, i) => palette[i % palette.length]),
            borderWidth: 0,
          },
        ],
      }}
    />
  );
}

export function ShareDoughnutChart({ labels, values }: { labels: string[]; values: number[] }) {
  const palette = chartPalette();
  return (
    <Doughnut
      options={{ ...legendOptions, cutout: "62%" }}
      data={{
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: labels.map((_, i) => palette[i % palette.length]),
            borderWidth: 0,
          },
        ],
      }}
    />
  );
}

export function TrendLineChart({ labels, values }: { labels: string[]; values: number[] }) {
  const palette = chartPalette();
  return (
    <Line
      options={{ ...baseOptions, elements: { line: { tension: 0.4 } } }}
      data={{
        labels,
        datasets: [
          {
            label: "kWh / month",
            data: values,
            borderColor: palette[0],
            backgroundColor: `color-mix(in oklab, ${palette[0]} 20%, transparent)`,
            fill: true,
            pointRadius: 3,
          },
        ],
      }}
    />
  );
}
