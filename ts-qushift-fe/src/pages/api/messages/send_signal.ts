import { getSession } from "next-auth/react";

const handler = async (req, res) => {
	const session = await getSession({ req });
	const { currTopicId } = req.body;

	const requestOptions = {
		method: "PUT"
	};

	const response = await fetch(`${process.env.API_BASE_URL}/topics/signal/${currTopicId}?userId=${session.user.id}`, requestOptions);

	res.status(200).json({});
};

export default handler;
