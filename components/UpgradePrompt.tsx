import { Link } from "@/i18n/routing";

const UpgradePrompt = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <p className="text-center text-gray-400">
        Upgrade to view all signals and add favorites.
      </p>
      <Link href="/profile?tab=upgrade">
        <button className="rounded-lg bg-green-800 p-2">Upgrade now</button>
      </Link>
    </div>
  );
};

export default UpgradePrompt;