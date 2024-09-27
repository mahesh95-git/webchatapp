import Layout from "@/components/ui/shared/layout";
import ListLayout from "@/components/ui/shared/listLayout";
import React from "react";

function layout({ children }) {
  return (
    <Layout>
      <ListLayout type={"friend"} path="/home/friends" />
      {children}
    </Layout>
  );
}

export default layout;
