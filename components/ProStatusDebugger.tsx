"use client";

import { useUser } from "@/providers/UserProvider";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";

/**
 * This component is a diagnostic tool to help debug pro user status detection issues.
 * It displays detailed information about the user's profile, plan, and pro status.
 * You can add this component to any page where you need to diagnose user status issues.
 */
export default function ProStatusDebugger() {
  const { user, profile, isPro, loading, refreshUser } = useUser();
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <Card className="w-full bg-slate-900 text-white">
        <CardHeader>
          <CardTitle>User Status Debugger</CardTitle>
          <CardDescription className="text-slate-300">
            Loading user data...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full bg-slate-900 text-white">
        <CardHeader>
          <CardTitle>User Status Debugger</CardTitle>
          <CardDescription className="text-slate-300">
            No user authenticated
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full border border-slate-700 bg-slate-900 text-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>User Status Debugger</CardTitle>
          <Badge className={isPro ? "bg-green-600" : "bg-slate-600"}>
            {isPro ? "PRO" : "FREE"}
          </Badge>
        </div>
        <CardDescription className="text-slate-300">
          Debugging tool for user status detection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-slate-300">User ID:</div>
          <div className="font-mono text-green-400">{user.id}</div>
          <div className="text-slate-300">Email:</div>
          <div>{user.email}</div>
          <div className="text-slate-300">Plan Value:</div>
          <div className="font-mono text-yellow-400">
            {profile?.plan || "undefined"}
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-2">
            <div className="text-sm text-slate-300">Full Profile Data:</div>
            <pre className="max-h-40 overflow-auto rounded bg-slate-800 p-3 text-xs text-slate-300">
              {JSON.stringify(profile, null, 2)}
            </pre>

            <div className="mt-2 text-sm text-slate-300">User Object:</div>
            <pre className="max-h-40 overflow-auto rounded bg-slate-800 p-3 text-xs text-slate-300">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide Details" : "Show Details"}
          </Button>
          <Button
            size="sm"
            onClick={() => refreshUser()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Refresh User
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
