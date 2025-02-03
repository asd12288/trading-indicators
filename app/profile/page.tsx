import { auth } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";
import avatar from "@/public/avatar.png";

async function page() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen flex-col items-center justify-start gap-5">
      <h1 className="text-4xl">Profile</h1>
      <div>
        <p className="mb-2 text-sm">Profile picture</p>
        <div className="flex items-center gap-5">
          <Image src={avatar} width={75} height={75} alt="avatar" />
          <button className="text-light rounded-md bg-green-700 px-3 py-3 text-sm transition-all hover:bg-green-800">
            Change picture
          </button>
          <button className="text-light rounded-md bg-red-700 px-3 py-3 text-sm hover:bg-red-800">
            Delete Picture
          </button>
        </div>
        <form action="">
          <div className="mt-5">
            <p className="mb-2 text-sm">Full name</p>
            <input
              type="text"
              className="w-full px-2 py-2 text-slate-950"
              defaultValue={session?.user.name}
            />
          </div>
          <div className="mt-5">
            <p className="mb-2 text-sm">Email</p>
            <input
              type="email"
              className="w-full px-2 py-2 text-slate-950"
              defaultValue={session?.user.email}
            />
          </div>
          <button className="text-light mt-6 rounded-md bg-green-700 px-3 py-3 text-sm transition-all hover:bg-green-800">
            Save changes
          </button>
        </form>

        <form action="">
          <h2></h2>
        </form>
      </div>
    </div>
  );
}

export default page;
