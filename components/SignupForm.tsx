"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";

// Shadcn UI form components
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// The server action we defined
import { signup } from "@/app/[locale]/(auth)/signup/actions";
import { OAuthButtons } from "./OauthSignin";
import { Link, useRouter } from "@/i18n/routing";

// The same Zod schema used on the server for synergy:
const signupFormSchema = z
  .object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignupFormValues = z.infer<typeof signupFormSchema>;

export function SignupForm() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Initialize React Hook Form, using the same schema on the client
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // The function that runs when the user clicks "Create Account"
  async function onSubmit(values: SignupFormValues) {
    setServerError(null);

    // 1) Convert our typed form values to FormData,
    //    since the server action expects FormData.
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("confirmPassword", values.confirmPassword);

    // 2) Start a transition so React won't block the UI
    startTransition(async () => {
      // 3) Call the server action
      const result = await signup(formData);

      // 4) Handle the response from the server
      if (result?.error) {
        // If there's an error from Supabase or Zod, show it
        setServerError(result.error);
      } else {
        // If success, send the user to a "check your email" screen
        // or anywhere else you like.
        router.push("/verify-email");
      }
    });
  }

  return (
    <div className="max-y-96 w-96 space-y-6 rounded-lg bg-slate-800 p-8 text-slate-50">
      <Form {...form}>
        {/* `form.handleSubmit(onSubmit)` wires up React Hook Form’s validation */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-slate-50">
              Enter your details below to create an account
            </p>
          </div>

          {/* Server-side error alert (if any) */}
          {serverError && (
            <div className="rounded border border-red-500 bg-red-100 p-2 text-center text-sm text-red-900">
              {serverError}
            </div>
          )}

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  {/* `Input` from Shadcn. Spread in the React Hook Form field. */}
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                {/* Displays any Zod validation error automatically */}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Minimum 8 characters"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-green-800 text-white hover:bg-green-900"
            disabled={isPending}
          >
            {isPending ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </Form>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-light">or continue with:</p>
        <OAuthButtons />
      </div>

      <div className="text-center text-sm font-light">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </div>
    </div>
  );
}
