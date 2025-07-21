"use client";

import * as React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from './ui/button';

export function DashboardHeaderContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = React.useState(searchParams.get('q') || '');
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);
  
  const pageTitles: { [key: string]: string } = {
    '/': 'Dashboard',
    '/favorites': 'Favorites',
    '/settings': 'Settings'
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
        <SidebarTrigger className="h-10 w-10 border-2 border-border bg-white dark:bg-gray-800 shadow-[2px_2px_0px_0px_rgb(0,0,0)] dark:shadow-[2px_2px_0px_0px_rgb(255,255,255)] hover:shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[4px_4px_0px_0px_rgb(255,255,255)] transition-all" />
      </div>

      <h1 className="text-lg sm:text-xl font-black md:text-2xl hidden md:block uppercase tracking-wider min-w-0 flex-shrink-0 text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
        {pageTitles[pathname] || 'Content Canvas'}
      </h1>
      
      <div className="flex w-full items-center gap-3 sm:gap-4 md:ml-auto md:gap-3 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial max-w-md" onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <Search className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search content..."
              className="pl-8 sm:pl-10 text-sm h-10 sm:h-12 w-full sm:w-[220px] md:w-[200px] lg:w-[280px] xl:w-[320px] border-4 border-border shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:shadow-[6px_6px_0px_0px_rgb(255,255,255)] font-bold uppercase tracking-wide bg-white dark:bg-gray-800 focus:shadow-[8px_8px_0px_0px_rgb(0,0,0)] dark:focus:shadow-[8px_8px_0px_0px_rgb(255,255,255)] transition-all"
              value={searchValue}
              onChange={handleSearch}
            />
          </div>
        </form>
        <div className="flex-shrink-0">
          <ThemeToggle />
        </div>
        <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 border-3 border-transparent hover:border-border bg-white dark:bg-gray-800 shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] hover:shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[6px_6px_0px_0px_rgb(255,255,255)] transition-all"
        >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 sm:h-5 sm:w-5"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">User Profile</span>
          </Button>
      </div>
    </header>
  );
}
