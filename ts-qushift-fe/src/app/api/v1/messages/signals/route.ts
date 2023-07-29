import { getSession } from "next-auth/react";

import { withoutRole } from "@/lib/auth";

const handler = withoutRole("banned", async (req, res, token) => {
  const session = await getSession({ req });
  const { currTopicId } = req.body;

  const headers = new Headers({
    Authorization: `Bearer ${token.accessToken}`,
  });

  const requestOptions = {
    method: "PUT",
    headers: headers,
  };

  const response = await fetch(
    `${process.env.API_BASE_URL}/api/v1/topics/signal/${currTopicId}?userId=${session?.user.name}`,
    requestOptions,
  );

  res.status(200).json({});
});

export default handler;
