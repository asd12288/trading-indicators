import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import React from "react";

const page = () => {
  return (
    <div className="flex h-screen flex-col items-center p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-4xl font-semibold">Checkout Success</h1>
        <p className="text-2xl">Thank you for your purchase!</p>
        <Link href="/signals">
          <Button className="bg-green-700 hover:bg-green-800">
            Explore Signals
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
