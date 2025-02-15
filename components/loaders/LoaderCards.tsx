import React from "react";

const LoaderCards = () => {
  return (
    <div className="grid grid-cols-3 gap-8">
      <LoadingCard />
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
    <div className="mb-4 h-96 w-72 animate-pulse rounded-sm bg-slate-900">
      <div className="flex h-full flex-col justify-between p-2">
        <div className="h-16 w-full bg-slate-800"></div>
        <div className="h-12 w-full bg-slate-800"></div>
        <div className="h-12 w-full bg-slate-800"></div>
        <div className="h-12 w-full bg-slate-800"></div>
        <div className="h-12 w-full bg-slate-800"></div>
      </div>
    </div>
  );
};
