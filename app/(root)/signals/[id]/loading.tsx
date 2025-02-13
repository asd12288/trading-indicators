"use client";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="loader animate-spin rounded-full border-b-2 border-gray-900 h-16 w-16"></div>
    </div>
  );
}