import nextConnect from "next-connect";
import EventSource from "eventsource";
import { getSession } from "next-auth/react";
import { withoutRole } from "../../../lib/auth";

const handler = nextConnect();

const sseMiddleware = (req, res, next) => {
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache");
	res.flushHeaders();

	const flushData = (data) => {
		const sseFormattedResponse = `data: ${data}\n\n`;
		res.write("event: message\n");
		res.write(sseFormattedResponse);
		res.flush();
	};

	Object.assign(res, {
		flushData
	});
	next();
};

const stream = withoutRole("banned", async (req, res, token) => {
	console.log("connect to SSE topics stream");

	const session = await getSession({ req });

	const headers = {
		headers: {
			"Authorization": `Bearer ${token.accessToken}`
		}
	};

	let eventSource = new EventSource(`${process.env.API_BASE_URL}/topics/stream/${session.user.id}`, headers);
	eventSource.onopen = (e) => {
		console.log("listen to sse endpoint now", e);
	};
	eventSource.onmessage = (e) => {
		res.flushData(e.data);
	};
	eventSource.onerror = (e) => {
		console.log("error", e);
	};

	// Close connection (detach subscriber)
	res.on("close", () => {
		console.log("close connection to topics...");
		eventSource.close();
		eventSource = null;
		res.end();
	});
});

// Stream API Data
handler.get(sseMiddleware, stream);

export default handler;