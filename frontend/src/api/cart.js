import { API_BASE_URL, authHeaders } from "./config";

export const getCart = async () => {
  const response = await fetch(`${API_BASE_URL}/getCart`, {
    headers: await authHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch cart");
  const data = await response.json();
  return data.cart || [];
};

export const addToCart = async (product) => {
  const response = await fetch(
    `${API_BASE_URL}/addToCart/product/${product.id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await authHeaders()),
      },
      body: JSON.stringify({
        title: product.title || product.name,
        price: product.price,
      }),
    },
  );
  if (!response.ok) throw new Error("Failed to add to cart");
  return response.json();
};

export const deleteFromCart = async (productId) => {
  const response = await fetch(
    `${API_BASE_URL}/deleteFromCart/product/${productId}`,
    {
      method: "DELETE",
      headers: await authHeaders(),
    },
  );
  if (!response.ok) throw new Error("Failed to delete from cart");
  return response.json();
};
