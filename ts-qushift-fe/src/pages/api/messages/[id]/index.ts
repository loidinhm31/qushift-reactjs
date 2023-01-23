import { environment } from "../../../../environments/environment";

const handler = async (req, res) => {
	const { id } = req.query;
	const { start } = req.query;

	const messagesRes = await fetch(`${environment.API_BASE_URL}/messages?topicId=${id}&start=${start}&size=10`, {
		method: "GET",
	});
	const messages = await messagesRes.json();

	// Send received messages to the client.
	res.status(200).json(messages);
};

export default handler;
