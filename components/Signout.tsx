import { signOut } from "@/auth";
import { RxExit } from "react-icons/rx";

export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <div></div>
      <button
        className="rounded-full bg-green-600 px-6 py-2 font-medium hover:bg-green-700 flex items-center gap-2"
        type="submit"
      >
        Sign Out
        <RxExit className="" />
      </button>
    </form>
  );
}
