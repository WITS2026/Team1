import { useEffect, useState } from "react";
import { getCart, deleteFromCart } from "../api/cart";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCartItems(data.items || []);
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

  const handleRemoveItem = async (productId) => {
    try {
      await deleteFromCart(productId);
      fetchCartData(); // Refresh list contents from database
    } catch (err) {
      console.error("Failed to delete from cart:", err);
    }
  };

  if (loading)
    return <div className="p-8 text-center">Loading your jewelry cart...</div>;
  if (error)
    return <div className="p-8 text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is currently empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product_id}
              className="flex justify-between items-center border-b pb-4"
            >
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-600">
                  ${item.price} x {item.quantity}
                </p>
              </div>
              <button
                onClick={() => handleRemoveItem(item.product_id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart;
