import React from "react";

const LoaderCards = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="flex animate-pulse flex-col gap-3 rounded-lg border border-slate-700/50 bg-slate-800/40 p-4 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="h-6 w-24 rounded bg-slate-700"></div>
            <div className="h-5 w-16 rounded bg-slate-700"></div>
          </div>
          <div className="h-12 w-full rounded bg-slate-700"></div>
          <div className="flex justify-between">
            <div className="h-4 w-20 rounded bg-slate-700"></div>
            <div className="h-4 w-16 rounded bg-slate-700"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoaderCards;
