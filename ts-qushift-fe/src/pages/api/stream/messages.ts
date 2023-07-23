import nextConnect from "next-connect";
import EventSource from "eventsource";
import { withoutRole } from "@/lib/auth";
import { ApiResponse } from "types/next-auth";
import { NextApiRequest } from "next";
import { JWT } from "next-auth/jwt";

const handler = nextConnect();

const sseMiddleware = (req, res: ApiResponse, next) => {
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
    flushData,
  });
  next();
};

const stream = withoutRole("banned", async (req: NextApiRequest, res: ApiResponse, token: JWT) => {
  console.log("connect to SSE message stream");

  const { topicId } = req.query;

  const headers = {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  };

  let eventSource = new EventSource(`${process.env.API_BASE_URL}/messages/stream?topicId=${topicId}`, headers);
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
    console.log("close connection to message...");
    eventSource.close();
    eventSource = null;
    res.end();
  });
});

// Stream API Data
handler.get(sseMiddleware, stream);

export default handler;
