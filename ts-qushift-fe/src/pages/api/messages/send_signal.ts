const handler = async (req, res) => {
	const { currTopicId } = req.body;

	const requestOptions = {
		method: "POST",
	}

	const response = await fetch(`${process.env.API_BASE_URL}/topics/signal/${currTopicId}`, requestOptions);

	res.status(200).json({});
};

export default handler;
