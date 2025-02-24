import { SignupForm } from "@/components/SignupForm";
import { Link } from "@/i18n/routing";
import { FaArrowLeft } from "react-icons/fa";

function page() {
  return (
    <div className="col-span-2 mx-auto my-10 flex min-w-96 flex-col items-center justify-center p-2">
      <Link href="/">
        <div className="mb-4 flex items-center gap-2">
          <FaArrowLeft className="text-lg" />
          <p className="text-sm font-light hover:cursor-pointer hover:underline">
            Back Home
          </p>
        </div>
      </Link>
      <h1 className="mb-4 text-3xl font-bold">Create a New Account</h1>

      <SignupForm />
    </div>
  );
}

export default page;
