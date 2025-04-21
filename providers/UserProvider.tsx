"use client";
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import supabaseClient from "@/database/supabase/supabase";
import { User, Session } from "@supabase/supabase-js";
import { Profile } from "@/lib/types";

interface UserContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  isPro: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  error: null,
  isPro: false,
  signOut: async () => {},
  refreshUser: async () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isPro, setIsPro] = useState<boolean>(false);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error: profileError } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      setProfile(data);
      setIsPro(data?.plan === "pro" || data?.plan === "premium");
      return data;
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();

      if (sessionError) throw sessionError;
      
      setSession(sessionData.session);

      if (sessionData?.session) {
        setUser(sessionData.session.user);
        
        if (sessionData.session.user.id) {
          await fetchProfile(sessionData.session.user.id);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      console.error("Error refreshing user:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setUser(null);
      setProfile(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  const signOut = async () => {
    try {
      await supabaseClient.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (err) {
      console.error("Error signing out:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  useEffect(() => {
    refreshUser();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setSession(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfile, refreshUser]);

  const value = {
    user,
    profile,
    session,
    loading,
    error,
    isPro,
    signOut,
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
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// For use in pages that already have the user data from server components
export function useClientUser(initialUser = null, initialProfile = null) {
  // Apply proper typing
  const [user] = useState<User | null>(initialUser);
  const [profile] = useState<Profile | null>(initialProfile);
  const [loading] = useState<boolean>(false);
  const isPro = profile?.plan === "pro" || profile?.plan === "premium";

  return { user, profile, loading, isPro };
}
