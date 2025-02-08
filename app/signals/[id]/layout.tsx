import React from "react";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    title: `Fast Signals - ${params.id}`,
    description: `Get the best signals for your trades (ID: ${params.id})`,
  };
}

const layout = ({ children }: { children: React.ReactNode }) => {
  return <section className="w-full">{children}</section>;
};

export default layout;
