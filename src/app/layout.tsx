import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { FavoritesProvider } from '@/contexts/favorites-context';
import { SettingsProvider } from '@/contexts/settings-context';
import { AuthProvider } from '@/contexts/auth-context';
import { ReduxProvider } from '@/components/redux-provider';
import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
  title: 'InfoScope',
  description: 'Your personalized content dashboard.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
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
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body className="font-body antialiased font-medium">
        <ReduxProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
              <FavoritesProvider>
                <SettingsProvider>
                  <AppShell>{children}</AppShell>
                  <Toaster />
                </SettingsProvider>
              </FavoritesProvider>
            </AuthProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
