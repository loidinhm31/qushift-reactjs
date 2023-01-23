import Head from "next/head";
import { getDashboardLayout } from "src/components/Layout";

export { getDefaultStaticProps as getStaticProps } from "src/lib/default_static_props";


const Dashboard = () => {
	return (
		<>
			<Head>
				<title>Dashboard</title>
				<meta name="description" content="QuShift." />
			</Head>
			<p>Hello World</p>
		</>
	);
};

Dashboard.getLayout = getDashboardLayout;

export default Dashboard;