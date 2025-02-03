import { signIn } from "@/auth";
import { RiFacebookFill } from "react-icons/ri";

export default function Signin() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button
        className="
        flex items-center justify-center 
        gap-2 
        px-8 py-2
        border border-gray-300
        rounded-md
        bg-white
        hover:bg-gray-50 
        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
        transition
       
      "
      >
        <RiFacebookFill size={25} color="blue" fill="blue" />

        <span className="text-gray-900 text-sm font-medium">Facebook</span>
      </button>
    </form>
  );
}
