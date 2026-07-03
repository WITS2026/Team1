export const deleteFromAwsCart = async (userId, productId) => {
  const baseUrl = "https://vcy5fudxq3.execute-api.us-east-1.amazonaws.com";

  const url = `${baseUrl}/deleteFromCart/user/${userId}/product/${productId}`;

  console.log("Targeting URL:", url);

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : { success: true };
};
