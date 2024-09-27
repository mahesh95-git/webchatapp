import Layout from "@/components/ui/shared/layout";
import ListLayout from "@/components/ui/shared/listLayout";
import React from "react";

function layout({ children, chats }) {
  return (
    <Layout>
      <ListLayout type={"allchat"} path="/home/allchats" />
      {children}
    </Layout>
  );
}

export default layout;
