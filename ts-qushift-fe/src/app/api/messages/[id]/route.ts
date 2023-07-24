import { getSession } from "next-auth/react";
import { withoutRole } from "@/lib/auth";

const handler = withoutRole("banned", async (req, res, token) => {
  // TODO(#1) not send userId when using authentication at backend
  const session = await getSession({ req });

  const { id } = req.query;
  let { start } = req.query;

  const headers = new Headers({
    Authorization: `Bearer ${token.accessToken}`,
  });

  const messagesRes = await fetch(
    `${process.env.API_BASE_URL}/messages?topicId=${id}&start=${start}&size=10&userId=${session!.user.id}`,
    {
      method: "GET",
      headers,
    },
  );

  const messages = await messagesRes.json();
  // Send received messages to the client.
  res.status(200).json(messages);
});

export default handler;
