import React from "react";

const loading = () => {
  return (
    <div className="bg-[#000014] h-screen">
      <div className="flex h-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-slate-50"></div>
      </div>
    </div>
  );
};

export default loading;
