"use client";

import * as React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { Search, LogOut, User, Settings } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-context';

export function DashboardHeaderContent() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <DashboardHeaderContentInner />
    </Suspense>
  );
}

function HeaderFallback() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const pageTitles: { [key: string]: string } = {
    '/': 'News',
    '/favorites': 'Favorites',
    '/settings': 'Settings',
    '/profile': 'Profile',
    '/movies': 'Movies',
    '/social': 'Social Media',
    '/recommendations': 'Recommendations'
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 sm:h-20 items-center gap-3 sm:gap-4 border-b-4 border-border bg-gradient-to-r from-blue-50/90 via-purple-50/90 to-indigo-50/90 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-indigo-900/40 backdrop-blur supports-[backdrop-filter]:bg-blue-50/60 px-4 sm:px-6 lg:px-8 shadow-[0_8px_0px_0px_rgb(0,0,0)] dark:shadow-[0_8px_0px_0px_rgb(255,255,255)]">
      <div className="sm:hidden flex-shrink-0">
        <SidebarTrigger className="h-10 w-10 border-2 border-border bg-white dark:bg-blue-800 shadow-[2px_2px_0px_0px_rgb(0,0,0)] dark:shadow-[2px_2px_0px_0px_rgb(255,255,255)] hover:shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[4px_4px_0px_0px_rgb(255,255,255)] transition-all" />
      </div>

      <h1 className="text-lg sm:text-xl font-black md:text-2xl hidden md:block uppercase tracking-wider min-w-0 flex-shrink-0 text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
        {pageTitles[pathname] || 'Content Canvas'}
      </h1>
      
      <div className="flex w-full items-center gap-3 sm:gap-4 md:ml-auto md:gap-3 lg:gap-4">
        <div className="flex-shrink-0">
          <ThemeToggle />
        </div>
        
        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 border-3 border-transparent hover:border-border bg-orange-100 dark:bg-orange-900 shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] hover:shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[6px_6px_0px_0px_rgb(255,255,255)] transition-all"
            >
              <div className="text-lg sm:text-xl">
                {user?.avatar || '👤'}
              </div>
              <span className="sr-only">User Profile</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 border-3 border-border shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] bg-white dark:bg-gray-800"
          >
            <DropdownMenuLabel className="font-bold uppercase tracking-wide">
              <div className="flex items-center gap-3">
                <div className="text-xl">{user?.avatar || '👤'}</div>
                <div>
                  <div className="font-black">{user?.name || 'User'}</div>
                  <div className="text-xs text-muted-foreground font-medium">{user?.email}</div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border h-0.5" />
            <DropdownMenuItem className="font-bold uppercase tracking-wide cursor-pointer focus:bg-primary/10">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="font-bold uppercase tracking-wide cursor-pointer focus:bg-primary/10">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border h-0.5" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="font-bold uppercase tracking-wide cursor-pointer focus:bg-red-500/10 text-red-600 dark:text-red-400"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function DashboardHeaderContentInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const [searchValue, setSearchValue] = React.useState(searchParams.get('q') || '');
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);
  
  const pageTitles: { [key: string]: string } = {
    '/': 'News',
    '/favorites': 'Favorites',
    '/settings': 'Settings',
    '/profile': 'Profile',
    '/movies': 'Movies',
    '/social': 'Social Media',
    '/recommendations': 'Recommendations'
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      if (!value) {
        current.delete("q");
      } else {
        current.set("q", value);
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
    }, 500);
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/signin');
  };
  
  React.useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 flex h-16 sm:h-20 items-center gap-3 sm:gap-4 border-b-4 border-border bg-gradient-to-r from-blue-50/90 via-purple-50/90 to-indigo-50/90 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-indigo-900/40 backdrop-blur supports-[backdrop-filter]:bg-blue-50/60 px-4 sm:px-6 lg:px-8 shadow-[0_8px_0px_0px_rgb(0,0,0)] dark:shadow-[0_8px_0px_0px_rgb(255,255,255)]">
      <div className="sm:hidden flex-shrink-0">
        <SidebarTrigger className="h-10 w-10 border-2 border-border bg-white dark:bg-blue-800 shadow-[2px_2px_0px_0px_rgb(0,0,0)] dark:shadow-[2px_2px_0px_0px_rgb(255,255,255)] hover:shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[4px_4px_0px_0px_rgb(255,255,255)] transition-all" />
      </div>

      <h1 className="text-lg sm:text-xl font-black md:text-2xl hidden md:block uppercase tracking-wider min-w-0 flex-shrink-0 text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
        {pageTitles[pathname] || 'Content Canvas'}
      </h1>
      
      <div className="flex w-full items-center gap-3 sm:gap-4 md:ml-auto md:gap-3 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial max-w-md" onSubmit={(e) => e.preventDefault()}>
        
        </form>
        <div className="flex-shrink-0">
          <ThemeToggle />
        </div>
        
        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 border-3 border-transparent hover:border-border bg-orange-100 dark:bg-orange-900 shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] hover:shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[6px_6px_0px_0px_rgb(255,255,255)] transition-all"
            >
              <div className="text-lg sm:text-xl">
                {user?.avatar || '👤'}
              </div>
              <span className="sr-only">User Profile</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 border-3 border-border shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] bg-white dark:bg-gray-800"
          >
            <DropdownMenuLabel className="font-bold uppercase tracking-wide">
              <div className="flex items-center gap-3">
                <div className="text-xl">{user?.avatar || '👤'}</div>
                <div>
                  <div className="font-black">{user?.name || 'User'}</div>
                  <div className="text-xs text-muted-foreground font-medium">{user?.email}</div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border h-0.5" />
            <DropdownMenuItem 
              onClick={() => router.push('/profile')}
              className="font-bold uppercase tracking-wide cursor-pointer focus:bg-primary/10"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => router.push('/settings')}
              className="font-bold uppercase tracking-wide cursor-pointer focus:bg-primary/10"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border h-0.5" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="font-bold uppercase tracking-wide cursor-pointer focus:bg-red-500/10 text-red-600 dark:text-red-400"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
