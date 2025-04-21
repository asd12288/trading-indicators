"use client";

import React from "react";
import { useUser, UserProvider } from "@/providers/UserProvider";

/**
 * @deprecated Please use useUser() and UserProvider from "@/providers/UserProvider" instead.
 * This is a compatibility layer pointing to our consolidated auth system.
 */
export const useAuth = useUser;

/**
 * @deprecated Please use UserProvider from "@/providers/UserProvider" instead.
 * This is a compatibility wrapper that uses our consolidated UserProvider.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <UserProvider>{children}</UserProvider>;
};
