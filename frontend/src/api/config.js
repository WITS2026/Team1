import { fetchAuthSession } from "aws-amplify/auth";

export const API_BASE_URL =
  "https://t0dcaxv5le.execute-api.us-east-1.amazonaws.com/Prod";

export async function authHeaders() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  return { Authorization: `Bearer ${token}` };
}
