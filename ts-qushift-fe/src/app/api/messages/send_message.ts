import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token || token.role === "banned") {
    return new Response("message: Unauthorized", {
      status: 403
    });
  }

  const data = request.body;

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${token.accessToken}`);

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data)
  };

  const response = await fetch(`${process.env.API_BASE_URL}/messages`, requestOptions);

  return new Response(await response.json(), {
    status: 200
  });
}
