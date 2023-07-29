import EventSource from "eventsource";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token || token.role === "banned") {
    return new Response("message: Forbidden", {
      status: 403,
    });
  }

  const topicId = request.nextUrl.searchParams.get("topicId");

  console.log("connect to SSE messages stream");

  const headers = {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  };

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const eventSource = new EventSource(`${process.env.API_BASE_URL}/api/v1/messages/stream?topicId=${topicId}`, headers);

  eventSource.onopen = (event: Event) => {
    console.log("listen to sse endpoint now", event);
  };

  eventSource.onmessage = async (event: MessageEvent) => {
    await writer.write(encoder.encode("event: message\n"));
    await writer.write(encoder.encode(`data: ${event.data}\n\n`));
  };

  eventSource.onerror = async () => {
    await writer.close();
    await eventSource.close();
  };

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
