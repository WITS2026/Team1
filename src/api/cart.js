const API_BASE_URL = "https://vcy5fudxq3.execute-api.us-east-1.amazonaws.com";
const CURRENT_USER_ID = "guest_user";

export const getCart = async (userId = CURRENT_USER_ID) => {
  const url = `${API_BASE_URL}/getCart/users/${userId}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch cart");
  const data = await response.json();

  let parsedData = data;
  if (data && typeof data.body === "string") {
    try {
      parsedData = JSON.parse(data.body);
    } catch (e) {
      console.error(e);
    }
  } else if (data && data.body) {
    parsedData = data.body;
  }

  let rawItems = [];
  if (parsedData && Array.isArray(parsedData.cart)) {
    rawItems = parsedData.cart;
  } else if (Array.isArray(parsedData)) {
    rawItems = parsedData;
  } else if (parsedData && Array.isArray(parsedData.Items)) {
    rawItems = parsedData.Items;
  }

  return {
    items: rawItems.map((item) => ({
      product_id: item.itemId || item.product_id || item.id || "",
      name: item.title || item.Title || "Jewelry Item",
      quantity: item.quantity || item.Quantity || 1,
      price: item.price || item.PriceAtAdded || 0,
    })),
  };
};

export const addToCart = async (
  product,
  quantity = 1,
  userId = CURRENT_USER_ID,
) => {
  const url = `${API_BASE_URL}/addToCart/user/${userId}/product/${product.id}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quantity,
      title: product.name || product.title,
      price: product.price,
    }),
  });
  if (!response.ok) throw new Error("Failed to add to cart");
  return response.json();
};

export const deleteFromCart = async (productId, userId = CURRENT_USER_ID) => {
  const url = `${API_BASE_URL}/deleteFromCart/user/${userId}/product/${productId}`;
  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete from cart");
  return response.json();
};
