"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutDashboard, Settings, PenSquare, Film, Sparkles, MessageCircle } from "lucide-react";

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
  { href: "/social", label: "Social Media", icon: MessageCircle },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/recommendations", label: "Recommendations", icon: Sparkles },

  { href: "/settings", label: "Settings", icon: Settings },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r-4 border-border">
      <SidebarHeader className="p-6 border-b-4 border-border bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-primary text-primary-foreground rounded-lg border-3 border-border shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:shadow-[3px_3px_0px_0px_rgb(255,255,255)]">
             <PenSquare className="w-6 h-6 flex-shrink-0" />
           </div>
          <h1 className="text-xl font-black tracking-wider group-data-[collapsible=icon]:hidden uppercase bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Content Canvas
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4 bg-gradient-to-b from-background to-muted/20">
        <SidebarMenu className="space-y-3">
          {menuItems.map(({ href, label, icon: Icon }) => (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === href}
                tooltip={{ children: label, side: 'right' }}
                className={cn(
                  "justify-start font-bold uppercase tracking-wide h-12 border-3 border-transparent hover:border-border hover:shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[6px_6px_0px_0px_rgb(255,255,255)] transition-all duration-200 px-4 gap-3 bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5",
                  pathname === href && "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-border shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:shadow-[6px_6px_0px_0px_rgb(255,255,255)] hover:from-primary hover:to-primary"
                )}
              >
                <Link href={href} className="flex items-center gap-3 w-full">
                  <div className={cn(
                    "p-1.5 rounded-md border-2 border-border transition-all",
                    pathname === href 
                      ? "bg-white text-primary shadow-[2px_2px_0px_0px_rgb(0,0,0)] dark:shadow-[2px_2px_0px_0px_rgb(255,255,255)]" 
                      : "bg-primary/10 text-primary"
                  )}>
                    <Icon className="h-4 w-4 flex-shrink-0" />
                  </div>
                  <span className="group-data-[collapsible=icon]:hidden font-black tracking-wider">{label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-6 border-t-4 border-border group-data-[collapsible=icon]:hidden bg-gradient-to-r from-muted/50 to-background">
        <div className="p-3 bg-white dark:bg-gray-800 border-3 border-border shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] rounded-lg">
          <div className="text-sm text-muted-foreground font-bold uppercase tracking-wide text-center">
              © {new Date().getFullYear()} Content Canvas
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
