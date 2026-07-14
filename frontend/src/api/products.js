import { API_BASE_URL } from "./config";

export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/product`);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};
