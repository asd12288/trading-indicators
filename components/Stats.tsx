import React from "react";

const Stats = ({ num, text, symbol = "" }) => {
  return (
    <div>
      <h3 className="text-center text-xl font-semibold md:text-left md:text-3xl lg:text-4xl xl:text-5xl">
        {num}
        {symbol}
      </h3>
      <p className="mt-1 text-center text-sm font-light md:text-left">{text}</p>
    </div>
  );
};

export default Stats;
