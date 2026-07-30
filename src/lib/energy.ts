/**
 * Pure energy calculation + recommendation engine.
 * Entirely software based: everything is derived from user-entered appliance data.
 */

export type Appliance = {
  id: string;
  user_id: string;
  appliance_name: string;
  category: string;
  power_rating: number;
  daily_usage_hours: number;
  quantity: number;
  created_at: string;
};

export type ApplianceStats = Appliance & {
  dailyConsumption: number; // kWh / day
  monthlyConsumption: number; // kWh / month (30 days)
  estimatedBill: number; // currency / month
  sharePercent: number;
};

export const CATEGORIES = [
  "Cooling",
  "Heating",
  "Lighting",
  "Kitchen",
  "Laundry",
  "Entertainment",
  "Computing",
  "Other",
] as const;

export const CURRENCIES: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
};

/** Energy (kWh/day) = (Watts × hours × quantity) / 1000 */
export function dailyConsumption(a: Pick<Appliance, "power_rating" | "daily_usage_hours" | "quantity">) {
  return (a.power_rating * a.daily_usage_hours * a.quantity) / 1000;
}

export function monthlyConsumption(daily: number) {
  return daily * 30;
}

export function estimateBill(monthlyKwh: number, tariff: number) {
  return monthlyKwh * tariff;
}

export function formatCurrency(value: number, currency: string) {
  const symbol = CURRENCIES[currency] ?? "";
  return `${symbol}${value.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
}

export function formatKwh(value: number) {
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} kWh`;
}

export function buildStats(appliances: Appliance[], tariff: number): ApplianceStats[] {
  const totalDaily = appliances.reduce((sum, a) => sum + dailyConsumption(a), 0);
  return appliances.map((a) => {
    const daily = dailyConsumption(a);
    const monthly = monthlyConsumption(daily);
    return {
      ...a,
      dailyConsumption: daily,
      monthlyConsumption: monthly,
      estimatedBill: estimateBill(monthly, tariff),
      sharePercent: totalDaily > 0 ? (daily / totalDaily) * 100 : 0,
    };
  });
}

export type Summary = {
  totalAppliances: number;
  totalUnits: number;
  totalDaily: number;
  totalMonthly: number;
  estimatedBill: number;
  highest?: ApplianceStats;
  lowest?: ApplianceStats;
  average: number;
  savingScore: number;
};

/**
 * Energy Saving Score (0-100). Rewards low household consumption and a
 * balanced load profile (no single appliance dominating usage).
 */
export function savingScore(stats: ApplianceStats[]): number {
  if (stats.length === 0) return 100;
  const monthly = stats.reduce((s, a) => s + a.monthlyConsumption, 0);
  const usageScore = Math.max(0, 100 - (monthly / 400) * 100); // 400 kWh/month = 0
  const dominance = Math.max(...stats.map((s) => s.sharePercent));
  const balanceScore = Math.max(0, 100 - Math.max(0, dominance - 30) * 1.4);
  return Math.round(Math.min(100, usageScore * 0.65 + balanceScore * 0.35));
}

export function summarize(stats: ApplianceStats[], tariff: number): Summary {
  const sorted = [...stats].sort((a, b) => b.monthlyConsumption - a.monthlyConsumption);
  const totalDaily = stats.reduce((s, a) => s + a.dailyConsumption, 0);
  const totalMonthly = monthlyConsumption(totalDaily);
  return {
    totalAppliances: stats.length,
    totalUnits: stats.reduce((s, a) => s + a.quantity, 0),
    totalDaily,
    totalMonthly,
    estimatedBill: estimateBill(totalMonthly, tariff),
    highest: sorted[0],
    lowest: sorted[sorted.length - 1],
    average: stats.length ? totalMonthly / stats.length : 0,
    savingScore: savingScore(stats),
  };
}

/** Category-wise totals for charts. */
export function byCategory(stats: ApplianceStats[]) {
  const map = new Map<string, number>();
  for (const s of stats) {
    map.set(s.category, (map.get(s.category) ?? 0) + s.monthlyConsumption);
  }
  return [...map.entries()].map(([category, kwh]) => ({ category, kwh }));
}

/**
 * Deterministic 12-month trend derived from the current load profile with a
 * seasonal factor (cooling peaks mid-year, heating peaks in winter).
 */
export function monthlyTrend(stats: ApplianceStats[]) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const base = stats.reduce((s, a) => s + a.monthlyConsumption, 0);
  const coolingShare = stats.filter((s) => s.category === "Cooling").reduce((s, a) => s + a.sharePercent, 0) / 100;
  const heatingShare = stats.filter((s) => s.category === "Heating").reduce((s, a) => s + a.sharePercent, 0) / 100;
  return months.map((month, i) => {
    const summer = Math.cos(((i - 5) / 12) * 2 * Math.PI); // peaks in June
    const winter = -summer;
    const factor = 1 + coolingShare * 0.35 * summer + heatingShare * 0.35 * winter;
    return { month, kwh: Math.round(base * factor * 100) / 100 };
  });
}

export type Recommendation = { message: string; priority: "high" | "medium" | "low" };

/** Rule-based engine: tips change with the user's actual appliance usage. */
export function generateRecommendations(stats: ApplianceStats[], tariff: number, currency: string): Recommendation[] {
  const tips: Recommendation[] = [];
  if (stats.length === 0) {
    return [{ message: "Add your first appliance to unlock personalised energy-saving advice.", priority: "medium" }];
  }

  const totalMonthly = stats.reduce((s, a) => s + a.monthlyConsumption, 0);
  const sorted = [...stats].sort((a, b) => b.monthlyConsumption - a.monthlyConsumption);
  const top = sorted[0];

  tips.push({
    message: `"${top.appliance_name}" is your biggest load at ${top.monthlyConsumption.toFixed(1)} kWh/month (${top.sharePercent.toFixed(0)}% of usage). Cutting its runtime by 1 hour/day saves about ${formatCurrency(estimateBill(monthlyConsumption((top.power_rating * top.quantity) / 1000), tariff), currency)} per month.`,
    priority: "high",
  });

  for (const a of stats) {
    if (a.category === "Cooling" && a.daily_usage_hours >= 6) {
      tips.push({
        message: `${a.appliance_name} runs ${a.daily_usage_hours}h/day. Raising the AC setpoint by 1°C typically trims 5-8% off cooling energy.`,
        priority: "high",
      });
    }
    if (a.category === "Lighting" && a.power_rating > 20) {
      tips.push({
        message: `${a.appliance_name} draws ${a.power_rating}W — replacing incandescent/CFL lighting with LEDs can cut that by up to 80%.`,
        priority: "high",
      });
    }
    if (a.category === "Entertainment" && a.daily_usage_hours >= 5) {
      tips.push({
        message: `${a.appliance_name} is on ${a.daily_usage_hours}h/day. Enable auto-sleep and switch off at the socket to remove standby power draw.`,
        priority: "medium",
      });
    }
    if (a.category === "Laundry" && a.quantity >= 1 && a.daily_usage_hours >= 1) {
      tips.push({
        message: `Run ${a.appliance_name} with full loads and a cold-wash cycle — heating water is usually the largest part of its consumption.`,
        priority: "medium",
      });
    }
    if (a.power_rating >= 1500) {
      tips.push({
        message: `${a.appliance_name} is a high-wattage appliance (${a.power_rating}W). Shift its use to off-peak hours and consider a 5-star rated replacement.`,
        priority: "medium",
      });
    }
    if (a.daily_usage_hours >= 18) {
      tips.push({
        message: `${a.appliance_name} runs ${a.daily_usage_hours}h/day — verify it genuinely needs to stay on and use a timer or smart plug schedule.`,
        priority: "high",
      });
    }
  }

  if (totalMonthly > 400) {
    tips.push({
      message: `Your household is projected at ${totalMonthly.toFixed(0)} kWh/month, above a typical 400 kWh benchmark. Target the top three appliances first for the fastest savings.`,
      priority: "high",
    });
  } else if (totalMonthly < 150) {
    tips.push({
      message: `Great work — ${totalMonthly.toFixed(0)} kWh/month is well below average. Keep monitoring monthly to hold the trend.`,
      priority: "low",
    });
  }

  tips.push({
    message: "Turn off unused appliances at the wall: standby loads can account for 5-10% of a household bill.",
    priority: "low",
  });
  tips.push({
    message: "When replacing appliances, choose the highest available energy-efficiency rating — the payback is usually under 3 years.",
    priority: "low",
  });

  const seen = new Set<string>();
  return tips.filter((t) => (seen.has(t.message) ? false : (seen.add(t.message), true)));
}
