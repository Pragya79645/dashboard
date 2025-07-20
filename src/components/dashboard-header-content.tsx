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
    <header className="sticky top-0 z-10 flex h-16 sm:h-20 items-center gap-2 sm:gap-4 border-b-4 border-border bg-background px-3 sm:px-4 lg:px-6 shadow-[0_4px_0px_0px_rgb(0,0,0)] dark:shadow-[0_4px_0px_0px_rgb(255,255,255)]">
      <div className="sm:hidden">
        <SidebarTrigger />
      </div>

      <h1 className="text-base sm:text-xl font-bold md:text-2xl hidden md:block uppercase tracking-wide">
        {pageTitles[pathname] || 'Content Canvas'}
      </h1>
      
      <div className="flex w-full items-center gap-2 sm:gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial" onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <Search className="absolute left-2 sm:left-2.5 top-2 sm:top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-7 sm:pl-8 text-sm h-10 sm:h-12 w-full sm:w-[200px] md:w-[180px] lg:w-[250px] xl:w-[300px] border-3 border-border shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] font-medium"
              value={searchValue}
              onChange={handleSearch}
            />
          </div>
        </form>
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-12 sm:w-12">
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
