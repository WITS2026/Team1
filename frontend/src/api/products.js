import { API_BASE_URL } from "./config";

export const getProducts = async ({
  category = "all",
  search = "",
  color = "all",
  material = "all",
  price = "all",
} = {}) => {
  const params = new URLSearchParams();

  if (category !== "all") {
    params.append("category", category);
  }

  if (search.trim() !== "") {
    params.append("search", search);
  }

  if (color !== "all") {
    params.append("color", color);
  }

  if (material !== "all") {
    params.append("material", material);
  }

  if (price !== "all") {
    params.append("price", price);
  }

  const url = `${API_BASE_URL}/product${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  console.log("REQUESTING:", url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();

  // API Gateway sometimes wraps Lambda response
  if (data.body) {
    return JSON.parse(data.body);
  }

  return data;
};
