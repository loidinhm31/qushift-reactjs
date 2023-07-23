import * as process from "process";
import { withoutRole } from "@/lib/auth";
import { getSession } from "next-auth/react";

const handler = withoutRole("banned", async (req, res, token) => {
  const session = await getSession({ req });

  const { start } = req.query;

  const headers = new Headers({
    Authorization: `Bearer ${token.accessToken}`,
  });

  const topicRes = await fetch(`${process.env.API_BASE_URL}/topics?userId=${session.user.id}&start=${start}&size=20`, {
    method: "GET",
    headers,
  });
  const topics = await topicRes.json();

  // Send received topics to the client.
  res.status(200).json(topics);
});

export default handler;
