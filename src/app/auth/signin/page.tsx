"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn, UserPlus, Mail, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

export default function SignInPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        router.push('/');
      } else {
        setError('Invalid email or password. Please check your credentials and try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    // For demonstration, we'll pre-fill with common test credentials
    setFormData({
      email: 'demo@example.com',
      password: 'demo123',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-indigo-900/20">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Welcome */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl border-4 border-border shadow-[8px_8px_0px_0px_rgb(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgb(255,255,255)] flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-wider uppercase bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Content Canvas
            </h1>
            <p className="text-muted-foreground font-medium mt-2">
              Your personalized content dashboard
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="border-4 border-border shadow-[8px_8px_0px_0px_rgb(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgb(255,255,255)] bg-white dark:bg-gray-800">
          <CardHeader className="space-y-2 text-center border-b-4 border-border bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30">
            <CardTitle className="text-xl font-black uppercase tracking-wide flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              Sign In
            </CardTitle>
            <CardDescription className="font-medium">
              Welcome back! Enter your credentials to continue.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 p-6">
            {error && (
              <Alert variant="destructive" className="border-3 border-red-500">
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-3 border-border focus:border-primary shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] font-medium h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="border-3 border-border focus:border-primary shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] font-medium h-12 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 font-black uppercase tracking-wide border-3 border-border shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] hover:shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[6px_6px_0px_0px_rgb(255,255,255)] transition-all"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t-2 border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
             
              </div>
            </div>

       
          </CardContent>

          <CardFooter className="border-t-4 border-border bg-gradient-to-r from-muted/50 to-background p-6">
            <div className="w-full text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Don't have an account?
              </p>
              <Button
                variant="link"
                onClick={() => router.push('/auth/signup')}
                className="text-primary font-bold uppercase tracking-wide p-0 h-auto hover:underline"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Create Account
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Info Card */}
        <Card className="border-3 border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)]">
          <CardContent className="p-4">
           
          
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
