import React from "react";
import SigninGoogle from "./SigninGoogle";
import SigninFacebook from "./SigninFacebook";
import Link from "next/link";

function LoginForm() {
  return (
    <div>
      <h3 className="mb-2 text-sm">Sign in with</h3>
      <div className="flex gap-4">
        <SigninGoogle />
        <SigninFacebook />
      </div>
      <div className="border-t border-gray-300 my-4"></div>
      <h3 className="text-sm mb-2">Or continue with email address</h3>
      <form className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email address"
          className="p-2 border border-gray-300 rounded-md placeholder:text-slate-500 text-slate-800"
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border border-gray-300 rounded-md placeholder:text-slate-500 text-slate-800"
        />
        <Link href="/forgot-password">
          <p className="text-xs font-thin hover:text-slate-300">
            Forgot your password?
          </p>
        </Link>
        <button className="bg-green-500 text-white p-2 rounded-sm">
          Sign in
        </button>
      </form>
      <p className="text-xs mt-4 text-center">
        <Link href="/signup">You dont have an account yet ?</Link>
      </p>
    </div>
  );
}

export default LoginForm;
