import Link from "next/link";
import React from "react";
import PlanCard from "./PlanCard";

const Plans = ({ size = "regular",  }) => {
  return (
    <section className="flex flex-col items-center justify-center space-y-8">
      <div className="itens-center mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <PlanCard
          benefits={{
            benefit1: "Notification for Email + SMS",
            benefit2: "Access to all Indicators",
            benefit3: "Deep Analysis of all the instruments",
            benefit4: "Access to new Indicators and Strategies",
          }}
          title="Pro - 1 Month"
          price={50}
          icon={"🥉"}
          size={size}
        />
        <PlanCard
          title="Pro - 12 Months"
          price={500}
          benefits={{
            benefit1: "Notification for Email + SMS",
            benefit2: "Access to all Indicators",
            benefit3: "Deep Analysis of all the instruments",
            benefit4: "Access to new Indicators and Strategies",
          }}
          icon={"🥇"}
          size={size}
        />
        <PlanCard
          title="Pro - 3 Months"
          price={120}
          benefits={{
            benefit1: "Notification for Email + SMS",
            benefit2: "Access to all Indicators",
            benefit3: "Deep Analysis of all the instruments",
            benefit4: "Access to new Indicators and History",
          }}
          icon={"🥈"}
          size={size}
        />
      </div>
      <Link href="/login"></Link>
    </section>
  );
};

export default Plans;
