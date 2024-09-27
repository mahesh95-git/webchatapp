import ListLayout from "@/components/ui/shared/listLayout";
import Layout from "@/components/ui/shared/layout";
function layout({ children }) {
  return (
    <Layout>
      <ListLayout type={"group"} path="/home/groups" />
      {children}
    </Layout>
  );
}

export default layout;
