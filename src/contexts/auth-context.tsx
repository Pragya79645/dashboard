"use client";

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  newsCategories: string[];
  movieGenres: string[];
  joinedDate: string;
  isOnboarded: boolean;
}

interface StoredUser extends UserProfile {
  password: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const generateUserId = () => Math.random().toString(36).substr(2, 9);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<UserProfile | null>('auth-user', null);
  const [users, setUsers] = useLocalStorage<StoredUser[]>('registered-users', []);

  // Sync auth state with cookie for middleware
  useEffect(() => {
    if (user) {
      // Set a cookie to indicate authentication for middleware
      document.cookie = `auth-user=${JSON.stringify(user)}; path=/; max-age=86400`; // 24 hours
    } else {
      // Remove the cookie when logged out
      document.cookie = 'auth-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find user in localStorage
    const storedUser = users.find(u => u.email === email && u.password === password);
    if (storedUser) {
      const { password: _, ...userProfile } = storedUser;
      setUser(userProfile);
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return false;
    }

    const newStoredUser: StoredUser = {
      id: generateUserId(),
      name,
      email,
      password,
      bio: '',
      avatar: '👤',
      newsCategories: ['technology', 'science'],
      movieGenres: ['action', 'comedy'],
      joinedDate: new Date().toISOString().split('T')[0],
      isOnboarded: false,
    };

    // Add user to stored users
    const updatedUsers = [...users, newStoredUser];
    setUsers(updatedUsers);

    // Set as current user (without password)
    const { password: _, ...userProfile } = newStoredUser;
    setUser(userProfile);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Also update the stored user data
      const updatedUsers = users.map(u => 
        u.id === user.id 
          ? { ...u, ...updates }
          : u
      );
      setUsers(updatedUsers);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      signup,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
