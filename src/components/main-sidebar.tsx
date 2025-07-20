"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutDashboard, Settings, PenSquare, Film, Sparkles } from "lucide-react";

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
  { href: "/", label: "News", icon: LayoutDashboard },
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/recommendations", label: "Recommendations", icon: Sparkles },

  { href: "/settings", label: "Settings", icon: Settings },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b-4 border-border">
        <div className="flex items-center gap-3">
           <PenSquare className="w-8 h-8 text-primary flex-shrink-0" />
          <h1 className="text-xl font-bold tracking-wide text-foreground group-data-[collapsible=icon]:hidden uppercase">
            Content Canvas
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu className="space-y-3">
          {menuItems.map(({ href, label, icon: Icon }) => (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === href}
                tooltip={{ children: label, side: 'right' }}
                className={cn(
                  "justify-start font-bold uppercase tracking-wide h-12 border-3 border-transparent hover:border-border hover:shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[4px_4px_0px_0px_rgb(255,255,255)] transition-all duration-150 px-4 gap-3",
                  pathname === href && "bg-primary text-primary-foreground border-border shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)]"
                )}
              >
                <Link href={href}>
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="group-data-[collapsible=icon]:hidden">{label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-6 border-t-4 border-border group-data-[collapsible=icon]:hidden">
        <div className="text-sm text-muted-foreground font-bold uppercase tracking-wide">
            © {new Date().getFullYear()} Content Canvas
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
