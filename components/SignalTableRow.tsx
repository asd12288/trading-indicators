import React from "react";

const SignalTableRow = ({ signal }) => {
  const { entry_price, exit_price, result_ticks, trade_duration, trade_side } =
    signal;
  return (
    <tr
      className={`border-b border-slate-700 ${trade_side === "Long" ? "bg-green-950" : "bg-red-950"} `}
    >
      <td className="px-6 py-4">{trade_side}</td>
      <td className="px-6 py-4">{entry_price}</td>
      <td className="px-6 py-4">{exit_price}</td>
      <td className="px-6 py-4">{result_ticks}</td>
      <td className="px-6 py-4">{trade_duration}</td>
    </tr>
  );
};

export default SignalTableRow;
