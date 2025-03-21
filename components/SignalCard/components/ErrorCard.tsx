import { AlertTriangle } from "lucide-react";
import { FC } from "react";

interface ErrorCardProps {
  instrumentName: string;
}

const ErrorCard: FC<ErrorCardProps> = ({ instrumentName }) => {
  return (
    <div className="flex h-[500px] w-full flex-col items-center justify-center rounded-lg border border-yellow-500 bg-yellow-950/10 p-4 text-center">
      <AlertTriangle className="mb-2 h-6 w-6 text-yellow-500" />
      <p className="text-sm text-slate-400">
        Missing data for {instrumentName || "this signal"}
      </p>
    </div>
  );
};

export default ErrorCard;
