import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, type Appliance } from "@/lib/energy";
import type { ApplianceInput } from "@/lib/queries";

const schema = z.object({
  appliance_name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  category: z.string().min(1, "Choose a category"),
  power_rating: z.coerce.number().positive("Power rating must be positive").max(50000),
  daily_usage_hours: z.coerce.number().min(0, "Hours cannot be negative").max(24, "Maximum is 24 hours"),
  quantity: z.coerce.number().int("Quantity must be a whole number").min(1, "Minimum quantity is 1").max(500),
});

const empty = { appliance_name: "", category: "Other", power_rating: "", daily_usage_hours: "", quantity: "1" };

/** Add / edit appliance modal with full client-side validation. */
export function ApplianceForm({
  open,
  onOpenChange,
  appliance,
  onSubmit,
  saving,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appliance?: Appliance | null;
  onSubmit: (values: ApplianceInput) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState<Record<string, string>>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      appliance
        ? {
            appliance_name: appliance.appliance_name,
            category: appliance.category,
            power_rating: String(appliance.power_rating),
            daily_usage_hours: String(appliance.daily_usage_hours),
            quantity: String(appliance.quantity),
          }
        : empty,
    );
  }, [open, appliance]);

  const set = (key: string) => (value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [i.path[0] as string, i.message])));
      return;
    }
    try {
      await onSubmit(parsed.data);
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save appliance");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{appliance ? "Edit appliance" : "Add appliance"}</DialogTitle>
          <DialogDescription>Consumption is calculated as watts × hours × quantity ÷ 1000.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="appliance_name">Appliance name</Label>
            <Input
              id="appliance_name"
              value={form.appliance_name}
              onChange={(e) => set("appliance_name")(e.target.value)}
              placeholder="Living room AC"
            />
            {errors.appliance_name && <p className="text-xs text-destructive">{errors.appliance_name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={set("category")}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="power_rating">Power (W)</Label>
              <Input
                id="power_rating"
                type="number"
                min={1}
                value={form.power_rating}
                onChange={(e) => set("power_rating")(e.target.value)}
                placeholder="1500"
              />
              {errors.power_rating && <p className="text-xs text-destructive">{errors.power_rating}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="daily_usage_hours">Hours / day</Label>
              <Input
                id="daily_usage_hours"
                type="number"
                min={0}
                max={24}
                step="0.5"
                value={form.daily_usage_hours}
                onChange={(e) => set("daily_usage_hours")(e.target.value)}
                placeholder="6"
              />
              {errors.daily_usage_hours && <p className="text-xs text-destructive">{errors.daily_usage_hours}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => set("quantity")(e.target.value)}
              />
              {errors.quantity && <p className="text-xs text-destructive">{errors.quantity}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : appliance ? "Save changes" : "Add appliance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
