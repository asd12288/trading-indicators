import Link from "next/link";
import React from "react";
import PlanCard from "./PlanCard";

const Plans = () => {
  return (
    <section className="mt-16 flex flex-col items-center justify-center space-y-8">
      <h2 className="text-5xl font-semibold">Plans</h2>
      <p className="mt-4 text-center text-2xl font-light">
        Weve got a plan perfect just for you
      </p>
      <div className="itens-center mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <PlanCard
          benefits={{
            benefit1: "Notification for Email + SMS",
            benefit2: "Access to all Indicators",
            benefit3: "Deep Analysis of all the instruments",
            benefit4: "Access to new Indicators and Strategies",
          }}
          title="Pro - 1 Month"
          price={20}
          icon={"🥉"}
        />
        <PlanCard
          title="Pro - 12 Months"
          price={110}
          benefits={{
            benefit1: "Notification for Email + SMS",
            benefit2: "Access to all Indicators",
            benefit3: "Deep Analysis of all the instruments",
            benefit4: "Access to new Indicators and Strategies",
          }}
          icon={"🥇"}
        />
        <PlanCard
          title="Pro - 3 Months"
          price={50}
          benefits={{
            benefit1: "Notification for Email + SMS",
            benefit2: "Access to all Indicators",
            benefit3: "Deep Analysis of all the instruments",
            benefit4: "Access to new Indicators and History",
          }}
          icon={"🥈"}
        />
      </div>
      <Link href="/login">
        <p className="mt-8 text-center font-thin hover:underline">
          Already got an account? log-in
        </p>
      </Link>
    </section>
  );
};

export default Plans;
