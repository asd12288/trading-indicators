import React from "react";
import "../(root)/globals.css"; // adjust this path to match your project

const layout = ({ children }) => {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
};

export default layout;
