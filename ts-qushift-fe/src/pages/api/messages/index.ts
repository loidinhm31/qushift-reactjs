const handler = async (req, res) => {
	const topicRes = await fetch(`${process.env.API_BASE_URL}/topics?userId=test-a&start=0&size=5`, {
		method: "GET",
	});
	const topics = await topicRes.json();

	// Send received topics to the client.
	res.status(200).json(topics);
};

export default handler;
