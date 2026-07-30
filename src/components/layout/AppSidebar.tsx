import { Link, useRouterState } from "@tanstack/react-router";
import {
  FiBarChart2,
  FiCpu,
  FiFileText,
  FiGrid,
  FiLogOut,
  FiSettings,
  FiUser,
  FiZap,
} from "react-icons/fi";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: FiGrid },
  { title: "Appliances", url: "/appliances", icon: FiCpu },
  { title: "Reports", url: "/reports", icon: FiFileText },
  { title: "Recommendations", url: "/recommendations", icon: FiBarChart2 },
  { title: "Profile", url: "/profile", icon: FiUser },
  { title: "Settings", url: "/settings", icon: FiSettings },
];

/** Responsive app sidebar; collapses to an icon rail on desktop. */
export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { signOut } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-3">
          <span className="gradient-primary grid size-9 shrink-0 place-items-center rounded-xl text-primary-foreground">
            <FiZap />
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-sidebar-foreground">EnergyTrack</span>
              <span className="block truncate text-[11px] text-muted-foreground">Smart consumption</span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => void signOut()} tooltip="Logout">
              <FiLogOut className="size-4" />
              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
