import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";

export async function PUT(request: NextRequest){
  const token = await getToken({ req: request });
  if (!token || token.role === "banned") {
    return new Response("message: Forbidden", {
      status: 403
    });
  }

  const session = await getServerSession();

  const { currTopicId } = await request.json();

  const headers = new Headers({
    Authorization: `Bearer ${token.accessToken}`,
  });

  const requestOptions = {
    method: "PUT",
    headers: headers,
  };

  const response = await fetch(
    `${process.env.API_BASE_URL}/api/v1/topics/signal/${currTopicId}?userId=${session?.user.id}`,
    requestOptions,
  );

  return new Response(await response.json(), {
    status: 200
  });
}
