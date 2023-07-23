import Head from "next/head";
import { getDashboardLayout } from "src/components/Layout";
import { Bluetooth } from "../components/Bluetooth";

export { getDefaultStaticProps as getStaticProps } from "src/lib/default_static_props";


const Dashboard = () => {
	return (
		<>
			<Head>
				<title>Dashboard</title>
				<meta name="description" content="QuShift." />
			</Head>

			<Bluetooth />

		</>
	);
};

Dashboard.getLayout = getDashboardLayout;

export default Dashboard;