"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Upload,
  ArrowRight,
  Check,
  Lock,
  BarChart2Icon,
} from "lucide-react";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send this to your backend
    // For now, we'll just simulate success
    setSubmitted(true);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pb-16 pt-8 text-white sm:pb-20 sm:pt-12 md:pb-24 md:pt-16">
      {/* Hero section */}{" "}
      <section className="container mx-auto px-6 py-20 text-center md:px-10 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block rounded-full bg-indigo-500/20 px-4 py-2 text-sm font-medium text-indigo-300">
            Coming Soon
          </span>
          <h1 className="mt-8 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-4xl font-bold leading-tight tracking-tight text-transparent md:text-5xl lg:text-6xl">
            Exciting New Features on the Horizon
          </h1>

          <div className="mx-auto mt-14 h-1 w-24 rounded-full bg-indigo-500"></div>
        </motion.div>
      </section>{" "}
      {/* Features section */}{" "}
      <section className="container mx-auto px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-16 md:grid-cols-2">
          {/* Mobile App Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-xl border border-slate-700/30 bg-gradient-to-br from-slate-800/80 to-slate-900 p-8 shadow-2xl"
          >
            {" "}
            <div className="mb-8 flex justify-center">
              <div className="rounded-full bg-blue-600/20 p-5">
                <Bell className="h-12 w-12 text-blue-300" />
              </div>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-blue-300 md:text-3xl">
              Mobile Trading Notifications
            </h2>
            <p className="mb-6 text-slate-300">
              Never miss a profitable trade opportunity again. Get instant
              alerts directly on your phone for optimal timing.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20">
                  <Check className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-slate-200">
                  Real-time trade notifications
                </span>
              </li>
              <li className="flex items-center">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20">
                  <Check className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-slate-200">
                  Customizable alert preferences
                </span>
              </li>
              <li className="flex items-center">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20">
                  <Check className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-slate-200">One-tap trade execution</span>
              </li>
            </ul>
            <div className="mt-8 flex items-center justify-center space-x-2 rounded-lg bg-slate-700/30 p-3 text-sm text-slate-300">
              <Lock className="h-4 w-4 text-slate-400" />
              <span>Currently in closed beta testing</span>
            </div>
          </motion.div>

          {/* AI Analysis Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="rounded-xl border border-slate-700/30 bg-gradient-to-br from-slate-800/80 to-slate-900 p-8 shadow-2xl"
          >
            {" "}
            <div className="mb-8 flex justify-center">
              <div className="rounded-full bg-purple-600/20 p-5">
                <BarChart2Icon className="h-12 w-12 text-purple-300" />
              </div>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-purple-300 md:text-3xl">
              AI-Powered Chart Analysis
            </h2>
            <p className="mb-6 text-slate-300">
              Upload any trading chart image and get instant AI analysis
              revealing potential opportunities and patterns.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20">
                  <Check className="h-4 w-4 text-purple-400" />
                </div>
                <span className="text-slate-200">
                  Pattern recognition technology
                </span>
              </li>
              <li className="flex items-center">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20">
                  <Check className="h-4 w-4 text-purple-400" />
                </div>
                <span className="text-slate-200">
                  Support/resistance identification
                </span>
              </li>
              <li className="flex items-center">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20">
                  <Check className="h-4 w-4 text-purple-400" />
                </div>
                <span className="text-slate-200">
                  Trend strength evaluation
                </span>
              </li>
              <li className="flex items-center">
                <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20">
                  <Check className="h-4 w-4 text-purple-400" />
                </div>
                <span className="text-slate-200">Risk assessment insights</span>
              </li>
            </ul>
            <div className="mt-8 flex items-center justify-center space-x-2 rounded-lg bg-slate-700/30 p-3 text-sm text-slate-300">
              <Upload className="h-4 w-4 text-slate-400" />
              <span>Upload any chart image for analysis</span>
            </div>
          </motion.div>
        </div>
      </section>{" "}
      {/* Notification form section */}{" "}
      <section className="container mx-auto px-6 py-20 md:px-10 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mx-auto max-w-xl rounded-xl border border-slate-700/30 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-10 shadow-2xl backdrop-blur-sm"
        >
          <h2 className="mb-2 text-center text-2xl font-bold text-white">
            Be the First to Know
          </h2>
          <p className="mb-6 text-center text-slate-300">
            Join our waitlist to get early access when these features launch.
          </p>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex rounded-lg bg-slate-700/30">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 bg-transparent px-4 py-3 text-white placeholder-slate-400 outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center rounded-r-lg bg-gradient-to-r from-indigo-500 to-blue-600 px-6 text-white transition-transform hover:scale-105"
                >
                  <span>Notify Me</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </form>
          ) : (
            <div className="rounded-lg bg-emerald-500/20 p-4 text-center text-emerald-200">
              <Check className="mx-auto mb-2 h-6 w-6" />
              <p>Thanks! We&apos;ll notify you when we launch.</p>
            </div>
          )}{" "}
          <div className="mt-8 text-center text-xs text-slate-400">
            We respect your privacy and won&apos;t share your email with third
            parties.
          </div>
        </motion.div>
      </section>
      {/* Visual elements */}
      <div className="pointer-events-none fixed left-0 top-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
        <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-500 opacity-10 blur-3xl"></div>
      </div>
    </div>
  );
}
