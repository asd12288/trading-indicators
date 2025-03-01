import React from "react";
import { Button } from "../ui/button";
import { Link } from "@/i18n/routing";

const Cta = () => {
  return (
    <div className="my-4 bg-slate-800 p-8 text-center">
      <h4 className="text-3xl font-medium">
        Subscribe now and take your trading to the next level
      </h4>
      <Link href="/signup">
        <Button className="mt-4">Get Started</Button>
      </Link>
    </div>
  );
};

export default Cta;
