import { getSession } from "next-auth/react";

const handler = async (req, res) => {
	// TODO(#1) not send userId when using authentication at backend
	const session = await getSession({ req });

	const { id } = req.query;
	let { start } = req.query;

	if (!start) {
		start = 0;
	}

	const messagesRes = await fetch(`${process.env.API_BASE_URL}/messages?topicId=${id}&start=${start}&size=10&userId=${session.user.id}`, {
		method: "GET",
	});

	const messages = await messagesRes.json();
	// Send received messages to the client.
	res.status(200).json(messages);
};

export default handler;
