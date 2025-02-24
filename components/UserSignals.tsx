"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import SignalTool from "./SignalCard/SignalTool";
import Link from "next/link";
import { Button } from "./ui/button";
import { deleteSignal } from "@/app/[locale]/(root)/profile/actions";
import { useRouter } from "next/navigation";

const UserSignals = ({ user, profile }) => {
  const userPreferences = profile?.preferences || {};
  const router = useRouter();

  async function handleDelete(signal: string) {
    await deleteSignal(signal, user.id);
    router.refresh();
  }

  if (!userPreferences || Object.keys(userPreferences).length === 0)
    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-medium">You dont have any Signals yet</h2>
        <Link href={`/signals`}>
          <Button>Add new Signals</Button>
        </Link>
      </div>
    );

  return (
    <div className="w-full">
      <Table className="w-[45rem]">
        <TableHeader>
          <TableRow>
            <TableHead>Signal</TableHead>

            <TableHead>Actions</TableHead>
            <TableHead>Remove from dashboard</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(userPreferences).map((signal) => {
            const { volume, favorite, notifications } = userPreferences[
              signal
            ] as { volume: boolean; favorite: boolean; notifications: boolean };
            return (
              <TableRow key={signal}>
                <TableCell>
                  <Link href={`/signals/${signal}`}>
                    {decodeURIComponent(signal)}
                  </Link>
                </TableCell>

                <TableCell>
                  <SignalTool
                    key={`${signal}-${JSON.stringify(userPreferences[signal])}`}
                    signalId={signal}
                    userId={user?.id}
                    defaultPrefs={{ notifications, volume, favorite }}
                    text="small"
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(signal)}>Remove</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserSignals;
