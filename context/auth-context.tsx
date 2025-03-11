"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import supabaseClient from "@/database/supabase/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const {
          data: { session },
          error,
        } = await supabaseClient.auth.getSession();

        if (error) {
          console.error("Error getting auth session:", error);
        }

        if (session) {
          setSession(session);
          setUser(session.user);
        }
      } catch (error) {
        console.error("Unexpected error during auth initialization:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setSession(session);
          setUser(session.user);
        } else {
          setSession(null);
          setUser(null);
        }
        setIsLoading(false);
      },
    );

    // Cleanup subscription
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    await supabaseClient.auth.signOut();
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
