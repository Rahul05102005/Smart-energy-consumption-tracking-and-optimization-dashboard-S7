import { FiActivity, FiPieChart, FiTrendingDown, FiZap } from "react-icons/fi";

/** Left-side illustration panel shared by the login and register pages. */
export function AuthArt({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="gradient-hero relative hidden overflow-hidden p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
      <div className="flex items-center gap-2">
        <span className="grid size-10 place-items-center rounded-xl bg-white/15">
          <FiZap className="size-5" />
        </span>
        <span className="text-lg font-bold">EnergyTrack</span>
      </div>

      <div className="max-w-md">
        <h2 className="text-3xl font-extrabold leading-tight">{title}</h2>
        <p className="mt-3 text-sm/6 opacity-90">{subtitle}</p>

        <div className="mt-8 grid gap-3">
          {[
            { icon: FiActivity, text: "Instant kWh calculation from watts × hours × quantity" },
            { icon: FiPieChart, text: "Appliance and category-wise interactive charts" },
            { icon: FiTrendingDown, text: "Personalised recommendations that cut your bill" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 rounded-xl bg-white/12 px-4 py-3 backdrop-blur">
              <item.icon className="size-4 shrink-0" />
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs opacity-75">100% software based — no meters, sensors or hardware needed.</p>

      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-16 size-80 rounded-full bg-white/10 blur-3xl" />
    </div>
  );
}
