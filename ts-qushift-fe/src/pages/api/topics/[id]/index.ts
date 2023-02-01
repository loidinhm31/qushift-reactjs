import * as process from "process";
import { withoutRole } from "../../../../lib/auth";
import { getSession } from "next-auth/react";

const handler = withoutRole("banned", async (req, res) => {
    const session = await getSession({ req });

	const { id } = req.query;

    const topicRes = await fetch(`${process.env.API_BASE_URL}/topics/${id}?userId=${session.user.id}`, {
		method: "GET",
	});

	try {
		const topic = await topicRes.json();

		// Send received topics to the client.
		res.status(200).json(topic);
	} catch (e) {
		res.status(400).json(e.id);
	}
});

export default handler;
