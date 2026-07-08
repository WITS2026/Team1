import React, { useEffect, useState } from "react";

const CURRENT_USER_ID = "guest_user"; 

// --- API Helper Function ---
const deleteFromAwsCart = async (userId, productId) => {
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

// --- Main Cart Component ---
export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Track the exact itemId currently being deleted
  const [deletingId, setDeletingId] = useState(null);

  // Fetch initial cart data from API Gateway
  const fetchCartData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://vcy5fudxq3.execute-api.us-east-1.amazonaws.com/getCart/users/${CURRENT_USER_ID}`);
      
      if (!response.ok) {
        throw new Error("Failed to retrieve cart items.");
      }
      
      const data = await response.json();
      
      if (data && data.cart) {
        setCartItems(data.cart);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error loading cart:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  // Handle item removal and local UI update
  const handleDelete = async (productId) => {
    setDeletingId(productId);
    try {
      await deleteFromAwsCart(CURRENT_USER_ID, productId);
      
      // Instantly filter out the removed item from the frontend list
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.itemId !== productId)
      );
      
      //alert("Item removed from cart!");
    } catch (error) {
      console.error("Failed to delete item from AWS backend:", error);
      alert("Could not remove item. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return <div className="p-8 text-center text-xl">Loading your jewelry cart...</div>;
  if (error)
    return <div className="p-8 text-red-500 text-center text-xl">Error: {error}</div>;

  return (
    <div style={{ padding: "20px" }} className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <p className="mt-4 text-gray-600">Your cart is currently empty.</p>
      ) : (
        cartItems.map((item) => {
          const isThisItemDeleting = deletingId === item.itemId;

          return (
            <div
              key={item.itemId}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div style={{ flexGrow: 1 }}>
                <p className="font-semibold text-lg">{item.title}</p>
                {/* FIXED: Dynamically tracks item.quantity from your database response */}
                <p className="text-gray-600">
                  ${item.price} x {item.quantity || 1}
                </p>
              </div>
              <button 
                onClick={() => handleDelete(item.itemId)} 
                disabled={deletingId !== null}
                className={`text-white px-4 py-2 rounded transition ${
                  isThisItemDeleting ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {isThisItemDeleting ? "Removing..." : "Delete"}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}