import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

import { MdEmail } from "react-icons/md";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
      <div className="rounded-lg bg-slate-900 p-6 shadow-lg flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-center text-2xl font-bold">Verify Your Email</h1>
          <MdEmail className="text-4xl" />
        </div>
        <p className="text-center text-gray-600">
          Check your inbox and click the verification link before Signin.
        </p>
        <div className="mt-4" >
          <Link href="/login" className="flex items-center justify-center gap-2">
            <p className="">Login</p>
            <ArrowRight className="top-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
