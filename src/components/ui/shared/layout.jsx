import React from "react";

function Layout({ children }) {
  return <div className="grid grid-cols-[350px_1fr] gap-2 px-6 py-[14px]">
    {children}
  </div>;
}

export default Layout;
