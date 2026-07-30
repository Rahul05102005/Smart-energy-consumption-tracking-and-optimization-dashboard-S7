import { createFileRoute, Link } from "@tanstack/react-router";
import { FiArrowRight, FiBarChart2, FiCpu, FiDownload, FiPieChart, FiShield, FiZap } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EnergyTrack | Smart Energy Consumption Dashboard" },
      {
        name: "description",
        content:
          "Track appliance-wise electricity use, estimate monthly bills and get personalised saving tips — 100% software, no hardware.",
      },
      { property: "og:title", content: "EnergyTrack | Smart Energy Consumption Dashboard" },
      {
        property: "og:description",
        content: "Calculate kWh, compare appliances, export reports and cut your electricity bill.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: FiCpu, title: "Appliance manager", text: "Add wattage, daily hours and quantity for every device you own." },
  { icon: FiZap, title: "Instant kWh maths", text: "Daily, monthly units and bill estimates using a configurable tariff." },
  { icon: FiPieChart, title: "Interactive charts", text: "Bar, pie, doughnut and 12-month trend visualisations." },
  { icon: FiBarChart2, title: "Smart recommendations", text: "Rule-based tips that adapt to your real usage pattern." },
  { icon: FiDownload, title: "PDF & CSV reports", text: "Download daily, weekly and monthly consumption reports." },
  { icon: FiShield, title: "Secure by design", text: "Authenticated accounts with row-level data isolation." },
];

const futureScope = [
  "IoT integration",
  "Smart meter integration",
  "Real-time monitoring",
  "AI consumption prediction",
  "Mobile application",
  "Voice assistant control",
];

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <span className="gradient-primary grid size-9 place-items-center rounded-xl text-primary-foreground">
            <FiZap />
          </span>
          <span className="text-lg font-bold">EnergyTrack</span>
        </div>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Get started</Link>
          </Button>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-8">
        <div className="gradient-hero shadow-elevated relative overflow-hidden rounded-3xl px-6 py-16 text-center text-primary-foreground sm:px-12">
          <p className="mx-auto w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            No sensors • No hardware • Pure software
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Smart Energy Consumption Tracking &amp; Optimization
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm/6 opacity-90 sm:text-base">
            Enter your appliance details once and get accurate kWh consumption, estimated bills, appliance comparisons
            and personalised recommendations to lower your electricity spend.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to="/register">
                Create free account <FiArrowRight className="ml-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 hover:bg-white/20">
              <Link to="/login">I already have an account</Link>
            </Button>
          </div>
          <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 size-80 rounded-full bg-white/10 blur-3xl" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <h2 className="text-2xl font-bold text-foreground">Everything you need to cut your bill</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="glass animate-rise rounded-2xl p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
                <f.icon />
              </span>
              <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="glass rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-foreground">Future scope</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Planned enhancements beyond the current software-only scope.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {futureScope.map((item) => (
              <li key={item} className="rounded-full bg-secondary px-4 py-2 text-sm text-secondary-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-6 text-center text-xs text-muted-foreground">
        EnergyTrack — Smart Energy Consumption Tracking and Optimization Dashboard.
      </footer>
    </div>
  );
}
