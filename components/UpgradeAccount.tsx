import React from "react";
import Benefit from "./smallComponents/Benefit";
import Plans from "./homePage/Plans";

const UpgradeAccount = () => {
  return (
    <div>
      <h1 className="text-center text-3xl font-semibold">
        Upgrade your account
      </h1>
      <Plans size="small" />
    </div>
  );
};

export default UpgradeAccount;
