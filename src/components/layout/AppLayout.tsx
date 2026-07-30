import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useProfile } from "@/lib/queries";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function Navbar() {
  const { data: profile } = useProfile();
  const { user } = useAuth();
  const label = profile?.name || user?.email || "Account";

  return (
    <header className="glass sticky top-0 z-20 flex h-14 items-center justify-between gap-3 rounded-none border-x-0 border-t-0 px-3 sm:px-5">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <span className="text-sm font-semibold text-foreground">Smart Energy Dashboard</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden max-w-40 truncate text-sm text-muted-foreground sm:block">{label}</span>
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary/12 text-xs font-semibold text-primary">
            {label.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border px-5 py-4 text-center text-xs text-muted-foreground">
      EnergyTrack — software-only energy consumption tracking &amp; optimization. © {new Date().getFullYear()}
    </footer>
  );
}

/** Shell used by every authenticated page: sidebar + navbar + footer. */
export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />
          <main className="flex-1 px-3 py-5 sm:px-6">{children}</main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
