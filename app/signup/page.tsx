import React from "react";
import Image from "next/image";
import Link from "next/link";
import login from "@/public/login.png";

function page() {
  return (
    <>
      <div className="md:grid md:grid-cols-2 gap-4 min-h-screen w-full">
        <Link href="/" className="absolute top-4 right-6 text-xs font-thin">
          Back to the main page
        </Link>

        <div className="md:flex justify-center p-8 rounded-sm hidden">
          <Image
            src={login}
            alt="logo"
            width={500}
            height={500}
            className="rounded-xl"
          />
        </div>
        <div className="flex flex-col justify-center items-center w-full md:mt-0 mt-20 p-8">
          <h2 className="text-5xl font-medium mb-5 text-left">Sign Up</h2>
        </div>
      </div>
    </>
  );
}

export default page;
