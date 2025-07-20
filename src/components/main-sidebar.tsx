"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutDashboard, Settings, PenSquare, Film } from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
           <PenSquare className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-semibold tracking-tighter text-foreground group-data-[collapsible=icon]:hidden">
            Content Canvas
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(({ href, label, icon: Icon }) => (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === href}
                tooltip={{ children: label, side: 'right' }}
                className={cn(
                  "justify-start",
                  pathname === href && "bg-primary/10 text-primary"
                )}
              >
                <Link href={href}>
                  <Icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
        <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Content Canvas
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
