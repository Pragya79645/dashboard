import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { FavoritesProvider } from '@/contexts/favorites-context';
import { SettingsProvider } from '@/contexts/settings-context';
import { ReduxProvider } from '@/components/redux-provider';
import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
  title: 'Content Canvas',
  description: 'Your personalized content dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ReduxProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <FavoritesProvider>
              <SettingsProvider>
                <AppShell>{children}</AppShell>
                <Toaster />
              </SettingsProvider>
            </FavoritesProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
