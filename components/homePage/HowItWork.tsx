import React from "react";
import { BackgroundGradientAnimation } from "../ui/background-gradient-animation";
import { Timeline } from "../ui/timeline";
import { time } from "console";
import { title } from "process";

type TimelineEntry = {
  title: string;
  content: React.ReactNode;
};

const data = [
  {
    title: "Monitoring",
    content: (
      <p>
        Our algorithms scan the market 24/7, looking for technical patterns or
        momentum signals.
      </p>
    ),
  },
  {
    title: "Analysis",
    content: (
      <p>
        Instruments are analyzed using real-time data and advanced indicators
        for high-accuracy alerts.
      </p>
    ),
  },
  {
    title: "Alert Generation",
    content: (
      <p>
        Once a setup meets predefined criteria, we push a ‘Smart Alert’ to your
        dashboard and optional Telegram.
      </p>
    ),
  },
];

const HowItWork = () => {
  return (
    <div>
      <h2 className="section-title">How It Work</h2>
      <Timeline data={data} />
    </div>
  );
};

export default HowItWork;
