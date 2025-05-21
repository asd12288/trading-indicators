# Authentication System Documentation

## Overview

The authentication system in this project uses Supabase Auth for user authentication. The system has been consolidated to use a single provider and hook, reducing duplication and improving maintainability.

## Main Components

### 1. User Provider

`UserProvider` in `providers/UserProvider.tsx` is the main authentication context provider that manages:

- User authentication state
- User profile data
- Session management
- Authentication functions (sign out, refresh)

```tsx
// How to use the UserProvider
import { UserProvider } from "@/providers/UserProvider";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
```

### 2. Auth Hook

The main hook to use for authentication is `useUser` from `providers/UserProvider.tsx`:

```tsx
import { useUser } from "@/providers/UserProvider";

function MyComponent() {
  const { 
    user,        // Supabase User object
    profile,     // User profile with extended data
    session,     // Supabase Session
    loading,     // Auth loading state
    error,       // Any auth errors
    isPro,       // Boolean indicating if user has pro/premium plan
    signOut,     // Function to sign out user
    refreshUser  // Function to refresh user data
  } = useUser();

  // Example usage
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <h1>Welcome, {profile?.username || user.email}</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### 3. Protected Routes

To protect routes that require authentication, use the `RequireAuth` component:

```tsx
import { RequireAuth } from "@/components/RequireAuth";

function ProtectedPage() {
  return (
    <RequireAuth>
      <div>This content is only visible to authenticated users</div>
    </RequireAuth>
  );
}
```

## Deprecated Hooks

The following hooks have been deprecated and redirect to the main `useUser` hook for backward compatibility:

- `useSession` from `hooks/useSession.ts`
- `useProfile` from `hooks/useProfile.ts`

Please update your code to use the primary `useUser` hook from `providers/UserProvider.tsx` when possible.

## Authentication Flow

1. **Sign Up**: Users sign up via the `SignupForm` component
2. **Email Verification**: Users verify their email through a link sent by Supabase
3. **Login**: Users login via the `LoginForm` component or OAuth providers
4. **Profile Access**: After authentication, user profile data is automatically loaded
5. **Sign Out**: Users can sign out using the `signOut` function from the `useUser` hook

## Extended User Profiles

After authentication, the system automatically fetches the user's profile from the `profiles` table in Supabase, which contains extended user data like:

- Username
- Avatar URL
- Subscription plan
- Role
- User preferences