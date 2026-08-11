import { useEffect, useState } from "react";
import { getCart, deleteFromCart } from "../api/cart";
import { createCheckoutSession } from "../api/payment";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const items = await getCart();
        setCartItems(items);
      } catch (error) {
        console.error("Error getting cart:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const removeItem = async (itemId) => {
    try {
      await deleteFromCart(itemId);

      setCartItems((current) =>
        current.filter((item) => item.itemId !== itemId),
      );
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("There was a problem removing this item.");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const url = await createCheckoutSession();
      window.location.href = url;
    } catch (error) {
      console.error("Error starting checkout:", error);
      alert("There was a problem starting checkout. Please try again.");
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-14">
        <h3 className="text-xl text-[#efe8dc]">Loading cart...</h3>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-14">
      <div className="page-section p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-semibold text-white mb-2">Your Cart</h1>
            <p className="text-[#c9b18a] max-w-2xl">Review your selected pieces and proceed with confidence.</p>
          </div>

          <div className="inline-flex items-center rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-sm text-[#c9b18a]">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-[2rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-12 text-center text-[#c9b18a]">
            <h3 className="text-2xl text-white mb-2">Your cart is feeling light!</h3>
            <p>Add a few elegant pieces from the shop to complete your look.</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.itemId}
                  className="rounded-[2rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h5 className="text-xl font-semibold text-white mb-2">{item.title}</h5>
                    <p className="text-[#c9b18a]">${Number(item.price).toFixed(2)} x {item.quantity}</p>
                  </div>
                  <button
                    type="button"
                    className="btn-gold rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em]"
                    onClick={() => removeItem(item.itemId)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="rounded-[2rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-8 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
              <h4 className="text-2xl font-semibold text-white mb-6">Order summary</h4>

              <div className="flex justify-between mb-3 text-[#c9b18a]">
                <span>Subtotal</span>
                <strong className="text-white">${total.toFixed(2)}</strong>
              </div>

              <div className="flex justify-between mb-8 text-[#b8aa97]">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <button
                className="btn-gold w-full rounded-full py-3 text-sm font-semibold uppercase tracking-[0.2em]"
                onClick={handleCheckout}
                disabled={checkingOut}
              >
                {checkingOut ? "Redirecting to checkout..." : "Checkout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
