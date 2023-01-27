import * as process from "process";
import { withoutRole } from "../../../lib/auth";

const handler = withoutRole("banned", async (req, res) => {
	const { user } = req.query;

	const topicRes = await fetch(`${process.env.API_BASE_URL}/topics?userId=${user}&start=0&size=5`, {
		method: "GET",
	});
	const topics = await topicRes.json();

	// Send received topics to the client.
	res.status(200).json(topics);
});

export default handler;
