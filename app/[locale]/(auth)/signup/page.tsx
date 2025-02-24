import { SignupForm } from "@/components/SignupForm";
import { Link } from "@/i18n/routing";
import { FaArrowLeft } from "react-icons/fa";

function page() {
  return (
    <div className="col-span-2 mx-auto my-10 flex min-w-96 flex-col items-center justify-center p-2">
      

      <SignupForm />
    </div>
  );
}

export default page;
