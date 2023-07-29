import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import * as process from "process";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req: request });
  if (!token || token.role === "banned") {
    return new Response("message: Forbidden", {
      status: 403,
    });
  }

  const session = await getServerSession();

  const id = params.id;

  const headers = new Headers({
    Authorization: `Bearer ${token.accessToken}`,
  });

  const topicRes = await fetch(`${process.env.API_BASE_URL}/api/v1/topics/${id}?userId=${session?.user.name}`, {
    method: "GET",
    headers,
  });

  const res = await topicRes.json();
  return NextResponse.json(res);
}