import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Appliance } from "@/lib/energy";

export type Settings = {
  user_id: string;
  currency: string;
  tariff: number;
  dark_mode: boolean;
  notifications: boolean;
};

export type Profile = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

/** All appliances belonging to the signed-in user (RLS scoped). */
export function useAppliances() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["appliances", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appliances")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Appliance[];
    },
  });
}

export function useSettings() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["settings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("user_settings").select("*").maybeSingle();
      if (error) throw error;
      if (data) return data as unknown as Settings;
      const { data: created, error: insertError } = await supabase
        .from("user_settings")
        .insert({ user_id: user!.id })
        .select()
        .single();
      if (insertError) throw insertError;
      return created as unknown as Settings;
    },
  });
}

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").maybeSingle();
      if (error) throw error;
      if (data) return data as unknown as Profile;
      const { data: created, error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user!.id,
          email: user!.email ?? "",
          name: (user!.user_metadata?.name as string) ?? "",
        })
        .select()
        .single();
      if (insertError) throw insertError;
      return created as unknown as Profile;
    },
  });
}

export function useSaveSettings() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (patch: Partial<Settings>) => {
      const { error } = await supabase
        .from("user_settings")
        .upsert({ user_id: user!.id, ...patch }, { onConflict: "user_id" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}

export function useSaveProfile() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (patch: { name?: string }) => {
      const { error } = await supabase.from("profiles").update(patch).eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export type ApplianceInput = {
  appliance_name: string;
  category: string;
  power_rating: number;
  daily_usage_hours: number;
  quantity: number;
};

export function useApplianceMutations() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["appliances"] });

  const create = useMutation({
    mutationFn: async (input: ApplianceInput) => {
      const { error } = await supabase.from("appliances").insert({ ...input, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async ({ id, ...input }: ApplianceInput & { id: string }) => {
      const { error } = await supabase.from("appliances").update(input).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("appliances").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
