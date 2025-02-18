import Link from "next/link";
import React from "react";
import FreePlanCard from "./FreePlanCard";
import PlanCard from "../PlanCard";

const Plans = ({ size = "regular" }) => {
  return (
    <section className="flex flex-col items-center justify-center space-y-8">
      <div className="items-center mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
        <FreePlanCard />
        <PlanCard />
      </div>
      <Link href="/login"></Link>
    </section>
  );
};

export default Plans;
