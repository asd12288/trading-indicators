import React from "react";

const LoaderCards = () => {
  return (
    <div className="h-96 w-72 animate-pulse rounded-sm bg-slate-900 mb-4">
      <div className="p-2 flex flex-col justify-between h-full">
        <div className="h-16 w-full bg-slate-800"></div>
        <div className="h-12 w-full bg-slate-800"></div>
        <div className="h-12 w-full bg-slate-800"></div>
        <div className="h-12 w-full bg-slate-800"></div>
        <div className="h-12 w-full bg-slate-800"></div>
      </div>
    </div>
  );
};

export default LoaderCards;
