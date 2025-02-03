import React from "react";
import { HiCheck } from "react-icons/hi";

const Benefit = ({ benefit }) => {
  return (
    <p className="flex items-center gap-2 text-green-50">
      <span>
        <HiCheck className="text-green-600" />
      </span>
      {benefit}
    </p>
  );
};

export default Benefit;
