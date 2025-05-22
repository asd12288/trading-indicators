'use client'

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import supabaseClient from "@/database/supabase/supabase";
import { User } from '@supabase/supabase-js';
import type { Profile } from "@/types";

type UserContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Use useCallback to prevent unnecessary re-renders
  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current session
      const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }
      
      if (!session) {
        setUser(null);
        setProfile(null);
        return;
      }

      setUser(session.user);

      // Get user profile data
      if (session?.user?.id) {
        const { data, error: profileError } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.warn('Error fetching profile:', profileError);
          // Don't throw here - we at least have the user
        } 
        
        if (data) {
          setProfile(data as Profile);
        }
      }
    } catch (err) {
      console.error('Error loading user:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      // Reset user state on error
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load user data on initial render
    refreshUser();

    // Set up auth state change subscription
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          await refreshUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [refreshUser]);

  const value = {
    user,
    profile,
    loading,
    error,
    refreshUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// For use in pages that already have the user data from server components
export function useClientUser(initialUser = null, initialProfile = null) {
  // Apply proper typing
  const [user] = useState<User | null>(initialUser);
  const [profile] = useState<Profile | null>(initialProfile);
  const [loading] = useState<boolean>(false);

  return { user, profile, loading };
}
