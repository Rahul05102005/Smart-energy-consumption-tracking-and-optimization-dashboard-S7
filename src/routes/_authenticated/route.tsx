import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { Loader } from "@/components/common/Loader";
import { useSettings } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

/** ProtectedRoute equivalent: redirects unauthenticated visitors to /login. */
function AuthenticatedLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data: settings } = useSettings();

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login" });
  }, [user, loading, navigate]);

  // Apply the user's dark-mode preference from Settings.
  useEffect(() => {
    if (typeof document === "undefined" || !settings) return;
    document.documentElement.classList.toggle("dark", settings.dark_mode);
  }, [settings]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader label="Checking your session…" />
      </div>
    );
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
