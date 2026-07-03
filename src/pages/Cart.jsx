import { useState } from "react";
import { deleteFromAwsCart } from "../cartApi";

export default function Cart() {
  const [loading, setLoading] = useState(false);

  // default data- to be replaced with the add items
  const [cartItems, setCartItems] = useState([
    { id: "prod987", name: "Sample Jewelry" },
  ]);
  const currentUserId = "user123";

  const handleDelete = async (productId) => {
    setLoading(true);
    try {
      await deleteFromAwsCart(currentUserId, productId);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId),
      );
      alert("Item removed from cart!");
    } catch (error) {
      console.error("Failed to delete item from AWS backend:", error);
      alert("Could not remove item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Shopping Cart</h1>
      {cartItems.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          <p>{item.name}</p>
          <button onClick={() => handleDelete(item.id)} disabled={loading}>
            {loading ? "Removing..." : "Delete"}
          </button>
        </div>
      ))}
    </div>
  );
}
