import React, { ReactNode } from "react";

export const revalidate = 1;

const layout = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export default layout;
