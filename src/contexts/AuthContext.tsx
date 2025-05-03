'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@prisma/client';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, role: UserRole) => Promise<void>;
  switchRole: (callback?: (newRole: UserRole) => void) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

        setUser({
            id: session.user.id,
            email: session.user.email!,
            role: profile.role
          });
        }
      } catch (error) {
        console.error('Error checking user session:', error);
    } finally {
      setLoading(false);
    }
  };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: profile?.role || UserRole.APPLICANT
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting login process');
      const { data: { user: authUser }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('AuthContext: Login error:', error);
        throw error;
      }

      if (authUser) {
        console.log('AuthContext: User authenticated:', authUser.id);
        
        // Get user profile with role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authUser.id)
          .single();

        if (profileError) {
          console.error('AuthContext: Profile fetch error:', profileError);
          throw profileError;
        }

        console.log('AuthContext: Profile fetched:', profile);

        // Set the user state with all required information
        const userWithRole: AuthUser = {
          id: authUser.id,
          email: authUser.email!,
          role: profile.role
        };

        console.log('AuthContext: Setting user state:', userWithRole);
        setUser(userWithRole);
      }
    } catch (error: any) {
      console.error('AuthContext: Login process error:', error);
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      console.log('Starting logout process...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }

      // Clear user state
      setUser(null);
      
      // Clear any stored session data
      localStorage.removeItem('supabase.auth.token');
      
      console.log('Logout successful');
    } catch (error: any) {
      console.error('Logout process error:', error);
      throw new Error('Failed to sign out. Please try again.');
    }
  };

  const register = async (email: string, password: string, role: UserRole) => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      if (authUser) {
        // Create profile with role
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authUser.id,
              email: authUser.email,
              role: role
            }
          ]);

        if (profileError) throw profileError;

        setUser({
          id: authUser.id,
          email: authUser.email!,
          role: role
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message);
    }
  };

  const switchRole = async (callback?: (newRole: UserRole) => void) => {
    if (!user) return;

    try {
      // Explicitly check the current role and set the new role
      let newRole: UserRole;
      if (user.role === 'APPLICANT') {
        newRole = 'EMPLOYER';
      } else {
        newRole = 'APPLICANT';
      }
      
      console.log('Switching role from', user.role, 'to', newRole);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Role switch error:', error);
        throw error;
      }

      console.log('Role switch successful:', data);
      
      // Update local user state with the new role
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          role: newRole
        };
      });
      
      // Call the callback with the new role
      if (callback) {
        callback(newRole);
      }
    } catch (error: any) {
      console.error('Role switch error:', error);
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
