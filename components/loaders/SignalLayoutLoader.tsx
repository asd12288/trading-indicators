"use client";

import { Skeleton } from "@/components/ui/skeleton";

const SignalLayoutLoader = () => {
  return (
    <div className="mb-8 flex flex-col p-2 md:p-12">
      {/* Back Link Loader */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-6 w-24" />
      </div>

      {/* Title and Tool Loader */}
      <div className="mt-4 flex animate-pulse flex-col gap-4 rounded-xl bg-slate-800 p-6 md:flex-row md:justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      {/* Overview & Chart Loaders */}
      <div className="mt-4 flex flex-col gap-4 bg-slate-950 md:grid md:grid-cols-3">
        {/* <Skeleton className="h-40 w-full rounded-2xl bg-slate-800" /> */}
        <Skeleton className="col-span-1 h-96 w-full rounded-2xl bg-slate-800" />
        <Skeleton className="col-span-2 h-96 w-full rounded-2xl bg-slate-800" />
        {/* <Skeleton className="h-40 w-full col-span-2 rounded-2xl bg-slate-800" /> */}
      </div>

      {/* Info Section Loader */}
      <div className="col-span-3 mt-4 h-96 w-full animate-pulse rounded-2xl bg-slate-800 p-6">
        <Skeleton className="mb-4 h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </div>
    </div>
  );
};

export default SignalLayoutLoader;
