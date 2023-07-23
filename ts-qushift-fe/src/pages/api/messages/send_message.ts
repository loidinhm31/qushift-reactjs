import { withoutRole } from "@/lib/auth";

const handler = withoutRole("banned", async (req, res, token) => {
  const data = req.body;

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${token.accessToken}`);

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };

  const response = await fetch(`${process.env.API_BASE_URL}/messages`, requestOptions);

  res.status(200).json({});
});

export default handler;
