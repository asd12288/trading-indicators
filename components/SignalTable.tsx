"use client";

import SignalTableRow from "./SignalTableRow";
import TableSignalsLoader from "./loaders/TableSignalsLoader";

const SignalTable = ({ allSignal }) => {
  if (allSignal?.length === 0) {
    return (
      <div className="text-slate-100">No signals found for the last 3 days</div>
    );
  }

  if (!allSignal) {
    return <TableSignalsLoader />;
  }

  return (
    <div className="relative hidden h-[28rem] overflow-y-auto rounded-sm text-slate-100 md:block">
      <table className="w-full table-auto p-4 text-left text-sm">
        <thead className="text-sx sticky top-0 h-16 bg-slate-700 uppercase">
          <tr>
            <th scope="col" className="px-6 py-3">
              Long/Short
            </th>
            <th scope="col" className="px-6 py-3">
              Entry Price
            </th>
            <th scope="col" className="px-6 py-3">
              Exit Price
            </th>
            <th scope="col" className="px-6 py-3">
              Result in Ticks
            </th>
            <th scope="col" className="px-6 py-3">
              Trade Duration
            </th>
          </tr>
        </thead>
        <tbody>
          {allSignal?.map((signal) => (
            <SignalTableRow key={signal.client_trade_id} signal={signal} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SignalTable;
