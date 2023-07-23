import Head from "next/head";
import { getDashboardLayout } from "@/components/Layout";

export { getDefaultStaticProps as getStaticProps } from "@/lib/default_static_props";

const Dashboard = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="QuShift." />
      </Head>
    </>
  );
};

Dashboard.getLayout = getDashboardLayout;

export default Dashboard;
