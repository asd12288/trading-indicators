import React from "react";
import Benefit from "./smallComponents/Benefit";
import Plans from "./homePage/Plans";
import { Button } from "./ui/button";

const UpgradeAccount = () => {
  return (
    <div>
      <h1 className="text-center text-3xl font-semibold">
        Upgrade your account
      </h1>
      <Plans  size="small" />
    </div>
  );
};

export default UpgradeAccount;
