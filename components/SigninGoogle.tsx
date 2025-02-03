import { signIn } from "@/auth";
import { FcGoogle } from "react-icons/fc";

export default function Signin() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/indicators" });
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
        <FcGoogle size={25} />
        <span className="text-gray-900 text-sm font-medium">
          Google
        </span>
      </button>
    </form>
  );
}
