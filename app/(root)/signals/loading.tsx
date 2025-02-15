"use client";

export default function Loading() {
  return (
    <div className="h-screen bg-[#000014]">
      <div className="flex h-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-slate-50"></div>
      </div>
    </div>
  );
}
