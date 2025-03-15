"use client";

import { useEffect, useState } from "react";

export default function PageBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY * 0.2);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient - darker */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900" />

      {/* Top gradient with reduced opacity */}
      <div
        className="absolute left-0 top-0 h-[800px] w-full bg-gradient-to-br from-blue-950/20 via-slate-950/0 to-transparent"
        style={{ transform: `translateY(-${scrollY * 0.2}px)` }}
      />

      {/* Hero section glow - reduced opacity */}
      <div className="absolute -left-32 top-0 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-emerald-800/5 to-teal-800/5 blur-3xl" />
      <div className="absolute -right-32 top-[30%] h-[500px] w-[500px] rounded-full bg-gradient-to-l from-blue-900/5 to-indigo-900/5 blur-3xl" />

      {/* Service section glow - reduced opacity */}
      <div
        className="absolute left-1/4 top-[80%] h-[400px] w-[400px] rounded-full bg-gradient-to-r from-purple-900/5 to-fuchsia-900/5 blur-3xl"
        style={{ transform: `translateY(-${scrollY * 0.1}px)` }}
      />

      {/* How it works section glow - reduced opacity */}
      <div
        className="absolute -right-32 top-[150%] h-[600px] w-[600px] rounded-full bg-gradient-to-l from-amber-900/5 to-yellow-900/5 blur-3xl"
        style={{ transform: `translateY(-${scrollY * 0.15}px)` }}
      />

      {/* Plans section glow - reduced opacity */}
      <div
        className="absolute -left-32 top-[220%] h-[400px] w-[400px] rounded-full bg-gradient-to-r from-cyan-900/5 to-blue-900/5 blur-3xl"
        style={{ transform: `translateY(-${scrollY * 0.2}px)` }}
      />

      {/* Testimonials section glow - reduced opacity */}
      <div
        className="absolute right-1/4 top-[270%] h-[500px] w-[500px] rounded-full bg-gradient-to-l from-emerald-900/5 to-green-900/5 blur-3xl"
        style={{ transform: `translateY(-${scrollY * 0.25}px)` }}
      />

      {/* CTA section glow - reduced opacity */}
      <div
        className="absolute left-1/3 top-[320%] h-[600px] w-[600px] rounded-full bg-gradient-to-r from-indigo-900/10 to-violet-900/10 blur-3xl"
        style={{ transform: `translateY(-${scrollY * 0.3}px)` }}
      />

      {/* Contact section glow - reduced opacity */}
      <div
        className="absolute right-1/3 top-[380%] h-[400px] w-[400px] rounded-full bg-gradient-to-l from-blue-900/5 to-cyan-900/5 blur-3xl"
        style={{ transform: `translateY(-${scrollY * 0.35}px)` }}
      />

      {/* Subtle grid overlay for texture - reduced opacity */}
      <div className="opacity-3 absolute inset-0 bg-[url('/grid.svg')] bg-[length:50px_50px]"></div>
    </div>
  );
}
