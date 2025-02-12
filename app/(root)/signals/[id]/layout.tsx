import React from "react";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const decodedId = decodeURIComponent(params.id);

  return {
    title: `Fast Signals - ${decodedId}`,
    description: `Get the best signals for your trades (ID: ${decodedId})`,
  };
}

const layout = ({ children }: { children: React.ReactNode }) => {
  return <section className="w-full">{children}</section>;
};

export default layout;
