import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req: request });
  if (!token || token.role === "banned") {
    return new Response("message: Forbidden", {
      status: 403,
    });
  }

  const session = await getServerSession();

  // TODO(#1) not send userId when using authentication at backend
  const id = params.id;
  const start = request.nextUrl.searchParams.get("start");

  const headers = new Headers({
    Authorization: `Bearer ${token.accessToken}`,
  });

  const messagesRes = await fetch(
    `${process.env.API_BASE_URL}/api/v1/messages?topicId=${id}&start=${start}&size=10&userId=${session?.user.name}`,
    {
      method: "GET",
      headers,
    },
  );

  const messages = await messagesRes.json();
  return NextResponse.json(messages);
}

