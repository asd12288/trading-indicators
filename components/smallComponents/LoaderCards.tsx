import React from "react";

const LoaderCards = () => {
  return (
    <div>
      <div className="flex animate-pulse flex-col">
        <div className="h-96 w-full rounded-lg bg-slate-700"></div>
        <div className="mt-4 h-4 w-1/4 bg-gray-600"></div>
        <div className="mt-2 h-4 w-1/2 bg-gray-600"></div>
        <div className="mt-2 h-4 w-1/3 bg-gray-600"></div>
        <div className="mt-2 h-4 w-1/2 bg-gray-600"></div>
        <div className="mt-2 h-4 w-1/4 bg-gray-600"></div>
      </div>
    </div>
  );
};

export default LoaderCards;
