import React from "react";

const LoaderCards = () => {
  return (
    // Use similar container styling as your actual list so loaders match layout
    <div className="md:grid-col-2 grid gap-4 rounded-lg bg-slate-800 md:min-h-[500px] md:min-w-[1000px] md:gap-8 md:p-8 lg:grid-cols-3">
      {/* Generate as many loading cards as needed */}
      <LoadingCard />
      <LoadingCard />
      <LoadingCard />
      <LoadingCard />
      <LoadingCard />
      <LoadingCard />
    </div>
  );
};

export default LoaderCards;

const LoadingCard = () => {
  return (
    <div className="flex animate-pulse flex-col items-start justify-between rounded-lg bg-slate-900 p-4 shadow-md">
      {/* Title placeholder */}
      <div className="mb-3 h-6 w-full rounded bg-slate-800"></div>

      {/* Large content placeholder (e.g., chart or main info) */}
      <div className="mb-4 h-32 w-full rounded bg-slate-800"></div>

      {/* A couple of lines to simulate smaller text/details */}
      <div className="mb-2 h-4 w-full rounded bg-slate-800"></div>
      <div className="mb-2 h-4 w-full rounded bg-slate-800"></div>

      {/* Action button or bottom info block */}
      <div className="mt-auto h-8 w-full rounded bg-slate-800"></div>
    </div>
  );
};
