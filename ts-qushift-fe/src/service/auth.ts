import process from "process";

export const authLogin = async (payload) => {
  return await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/v1/auth/login`, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(payload),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};
