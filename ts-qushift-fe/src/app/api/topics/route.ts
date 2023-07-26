import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import * as process from "process";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token || token.role === "banned") {
    return new Response("message: Forbidden", {
      status: 403
    });
  }

  const session = await getServerSession();

  const start = request.nextUrl.searchParams.get("start");

  const headers = new Headers({
    Authorization: `Bearer ${token?.accessToken}`
  });

  const topicRes = await fetch(`${process.env.API_BASE_URL}/topics?userId=${session?.user.name}&start=${start}&size=20`, {
    method: "GET",
    headers
  });

  const res = await topicRes.json();
  return NextResponse.json(res);
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token || token.role === "banned") {
    return new Response("message: Forbidden", {
      status: 403
    });
  }

  const { topicName, topicMembers } = await request.json();

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${token.accessToken}`);

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      name: topicName,
      members: topicMembers
    })
  };

  const response = await fetch(`${process.env.API_BASE_URL}/topics`, requestOptions);
  const message = await response.json();

  return new Response(JSON.stringify(message), {
    status: response.status
  });
}