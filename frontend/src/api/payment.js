import { API_BASE_URL, authHeaders } from "./config";

export const createCheckoutSession = async () => {
  const response = await fetch(`${API_BASE_URL}/createCheckoutSession`, {
    method: "POST",
    headers: await authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to start checkout");
  const { url } = await response.json();
  return url;
};
