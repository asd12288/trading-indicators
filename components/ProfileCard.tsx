import Image from "next/image";
import React from "react";
import avatar from "@/public/avatar.png";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import ResetPasswordForm from "./ResetPasswordForm";

const ProfileCard = ({ user }) => {
  return (
    <div>
      <h1 className="mb-4 text-3xl font-semibold">My Profile</h1>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <Image
            src={user?.avatar ? user.avatar : avatar}
            alt="avatar"
            width={75}
            height={75}
          />
          <Button>Change Picture</Button>
          <Button>Delete Password</Button>
        </div>

        <div className="w-full space-y-2">
          <Label>Username</Label>
          <Input defaultValue={user?.name} />
        </div>

        <div className="w-full space-y-2">
          <Label>Email</Label>
          <Input defaultValue={user.email} />
        </div>
      </div>
      <ResetPasswordForm />
    </div>
  );
};

export default ProfileCard;
