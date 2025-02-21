import Image from "next/image";
import React from "react";
import runningCard from "@/public/runningCard.png";
import fufiledCard from "@/public/fufiledCard.png";
import { createClient } from "@/database/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SignalTool from "@/components/SignalCard/SignalTool";
import AlertNotification from "@/components/AlertNotification";

export default async function FeatureDocsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen w-full p-6 text-slate-50 md:p-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-4xl font-bold text-white">
          Trader Map: Feature Overview
        </h1>
        <p className="mb-12 text-slate-300">
          Welcome to Trader Map! Below you’ll find a clear explanation of our
          main features, key trading terms, and how to interpret your trading
          signal cards.
        </p>

        {/* 1. Core Features */}
        <section className="mb-16">
          <h2 className="mb-2 text-2xl font-bold text-white">
            1. Core App Sections
          </h2>
          <ul className="ml-4 list-disc space-y-2 text-slate-300">
            <li>
              <strong>Trader Map</strong>: Provides an overview of the markets
              and real-time trades. Think of it as your main dashboard to see
              running signals in one place, building your strategy around them.
            </li>
            <li>
              <strong>Signals</strong>: Displays all active and past trading
              signals. Each signal will show whether it’s a Long or Short trade,
              entry price, exit price (if closed), and performance metrics.
            </li>
            <li>
              <strong>Profile</strong>: Your account page to view or update
              personal info, adjust subscription plans, or set preferences like
              notifications and alerts.
            </li>
          </ul>
        </section>

        {/* 2. Trading Terms */}
        <section className="mb-16">
          <h2 className="mb-2 text-2xl font-bold text-white">
            2. Key Trading Terms in the App
          </h2>
          <div className="space-y-6 text-slate-300">
            <div>
              <h3 className="text-xl font-semibold text-slate-100">
                MAE (Maximum Adverse Excursion)
              </h3>
              <p className="mt-2">
                MAE measures how far a trade moved against you (i.e., how much
                “adverse” price movement you encountered) before the trade was
                closed. A higher MAE suggests the trade spent some time in
                negative territory before potentially turning profitable or
                being stopped out.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-100">
                MFE (Maximum Favorable Excursion)
              </h3>
              <p className="mt-2">
                MFE tracks the biggest unrealized gain achieved during a trade
                before it was closed. If your trade is “in profit” by 10 ticks
                at some point, but it closes at 5 ticks, then the MFE was 10
                ticks.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-100">
                Exit Price
              </h3>
              <p className="mt-2">
                The exact price at which the position was closed. This value is
                automatically recorded once the trade finishes (either by
                hitting a target, a stop, or manual close).
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-100">
                Trade Duration
              </h3>
              <p className="mt-2">
                How long the position remained open, measured in minutes or
                hours. The app calculates this from the time you entered (Entry
                Price) to the time you exited (Exit Price).
              </p>
            </div>
          </div>
        </section>

        {/* 3. Signal Cards Explanation */}
        <section className="mb-16">
          <h2 className="mb-2 text-2xl font-bold text-white">
            3. Signal Cards
          </h2>
          <p className="mb-4 text-slate-300">
            Signals in Trader Map are shown via specialized cards. Each card
            contains trade details including the type of trade (Long or Short),
            status, entry/exit prices, and performance metrics.
          </p>
          <div className="space-y-4 text-slate-300">
            <div className="flex items-center justify-between gap-8">
              <div className="flex-1 rounded-md bg-slate-800 p-4">
                <h3 className="text-xl font-semibold text-white">
                  Running Signal Card
                </h3>
                <p className="mt-2">
                  Displays trades that are actively in progress:
                </p>
                <ul className="ml-5 mt-2 list-disc space-y-2">
                  <li>
                    <strong>Entry Price</strong>: The price at which the trade
                    was opened.
                  </li>
                  <li>
                    <strong>Stop Price</strong>: The protective stop-loss level.
                  </li>
                  <li>
                    <strong>Target Price</strong>: The desired profit-taking
                    level.
                  </li>
                  <li>
                    <strong>Trade Duration</strong>: How long the trade has been
                    running so far.
                  </li>
                  <li>
                    <strong>Status</strong>: Usually shows “Running” while the
                    trade is active.
                  </li>
                </ul>
              </div>
              <div className="flex h-[480px] w-96 items-center justify-center rounded-md bg-slate-800 p-4">
                {/* <RunningSignalCard /> */}
                <Image src={runningCard} alt="Running Signal Card" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-8">
              <div className="flex h-[480px] w-96 items-center justify-center rounded-md bg-slate-800 p-4">
                <Image src={fufiledCard} alt="Fulfilled Signal Card" />
              </div>
              <div className="flex-1 rounded-md bg-slate-800 p-4">
                <h3 className="text-xl font-semibold text-white">
                  Fulfilled Signal Card
                </h3>
                <p className="mt-2">
                  Displays trades that have already closed:
                </p>
                <ul className="ml-5 mt-2 list-disc space-y-5">
                  <li>
                    <strong>Entry Price</strong> &amp;{" "}
                    <strong>Exit Price</strong>: Shows where you got in and out.
                  </li>
                  <li>
                    <strong>MAE</strong> &amp; <strong>MFE</strong>: Reflects
                    how the trade performed at its worst and best.
                  </li>
                  <li>
                    <strong>Trade Duration</strong>: The total time from entry
                    to exit.
                  </li>
                  <li>
                    <strong>Status</strong>: Typically “Trade Over” or “Closed.”
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Signal Tool */}
        <section className="mb-16">
          <h2 className="mb-2 text-2xl font-bold text-white">
            4. Signal Tool (Notifications, Volume, Favorites) - Pro Users
          </h2>
          <p className="mb-4 text-slate-300">
            Each signal can be customized to suit your preferences:
          </p>
          <ul className="ml-5 list-disc space-y-5 text-slate-300">
            <li>
              <strong>Notifications</strong>: Turn these on if you’d like to
              receive alerts (in-app or Telegram) when certain conditions are
              met for that signal.
            </li>
            <li>
              <strong>Volume</strong>: Enable or disable sound alerts for new
              signals, so you can hear a beep when a trade triggers.
            </li>
            <li>
              <strong>Favorite</strong>: Mark a signal as a favorite to find or
              filter it more easily in your dashboard.
            </li>
          </ul>

          <div className="mt-8 flex items-center justify-center rounded-lg bg-slate-800 py-4">
            <SignalTool
              userId="0e4aab79-6b31-4917-88a8-0e1cb02a6f9f"
              signalId="NQ"
            />
          </div>
        </section>

        {/* 5. Alerts */}
        <section className="mb-16">
          <h2 className="mb-2 text-2xl font-bold text-white">5. Alerts</h2>
          <p className="text-slate-300">
            You can see all recent alerts in the “Alerts” section. These
            notifications inform you about new opportunities or changes in the
            market. If you’re a <strong>Pro user</strong>, you can also filter
            which instruments you receive alerts for. Otherwise, you’ll see all
            general alerts.
          </p>
          <div className="mt-8 flex items-center justify-center rounded-lg bg-slate-800 py-4">
            <Link href="/alerts"></Link>
            <h4 className="animate-pulse text-center text-sm md:text-xl md:font-semibold">
              (10/21) 20:30 - Alert: Potential{" "}
              <span className="text-green-700">Long</span> Opportunity on NQ -
              Level 21992.75 Stay vigilant.
            </h4>
          </div>
        </section>

        {!user && (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg">Dont have an account yet?</p>
            <Link href="/signup">
              <Button className="bg-green-700 hover:bg-green-800">
                Create An Account
              </Button>
            </Link>
          </div>
        )}

        {user && (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg">Ready to start trading?</p>
            <Link href="/signals">
              <Button className="bg-green-700 hover:bg-green-800">
                View All Signals
              </Button>
            </Link>
          </div>
        )}

        {/* END */}
        <footer className="mt-16 text-slate-400">
          <hr className="mb-4 border-slate-700" />
          <p className="text-center text-sm">
            &copy; {new Date().getFullYear()} Trader Map. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
