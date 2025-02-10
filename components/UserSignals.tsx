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

const UserSignals = ({ user, profile }) => {
  const userPreferences = profile?.[0].preferences || {};

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
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Signal</TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(userPreferences).map((signal) => {
            const { volume, favorite, notifications } = userPreferences[signal];
            return (
              <TableRow key={signal}>
                <Link href={`/signals/${signal}`}>
                  <TableCell>{decodeURIComponent(signal)}</TableCell>
                </Link>

                <TableCell>
                  <SignalTool
                    signalId={signal}
                    userId={user?.id}
                    defaultPrefs={{ notifications, volume, favorite }}
                    text="small"
                  />
                </TableCell>
                <TableCell>
                  <Button>Delete</Button>
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
