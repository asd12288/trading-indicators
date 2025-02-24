import { Link } from "@/i18n/routing";
import SignalCard from "./SignalCard";

const SignalsGrid = ({ signals }) => {
  return (
    <div className="md:grid-col-2 grid gap-4 rounded-lg bg-slate-800 md:min-h-[500px] md:min-w-[1000px] md:gap-8 md:p-8 lg:grid-cols-3">
      {signals.map((signal, index) => (
        <Link
          className="flex justify-center"
          key={`${signal.instrument_name}-${index}`}
          href={`signals/${signal.instrument_name}`}
        >
          <SignalCard signalPassed={signal} />
        </Link>
      ))}
    </div>
  );
};

export default SignalsGrid;
