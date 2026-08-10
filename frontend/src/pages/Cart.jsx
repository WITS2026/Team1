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
      <div className="container my-5">
        <h3>Loading cart...</h3>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="page-section">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-4 mb-4">
          <div>
            <h1 className="mb-2 text-primary">Your Cart</h1>
            <p className="text-muted mb-0">
              Review your selected items, update quantities, or remove anything
              you don't want.
            </p>
          </div>

          <div className="text-end">
            <span className="badge rounded-pill bg-warning text-dark py-2 px-3">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <h3 className="mb-3">Your cart is feeling light!</h3>
            <p className="text-muted">
              Add a few pieces from the shop to make it glow.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="list-group">
                {cartItems.map((item) => (
                  <div
                    key={item.itemId}
                    className="list-group-item list-group-item-action d-flex flex-column flex-sm-row gap-3 align-items-start align-items-sm-center p-4 rounded-4 shadow-sm"
                  >
                    <div className="flex-grow-1">
                      <h5 className="mb-1">{item.title}</h5>
                      <p className="mb-0 fw-semibold">
                        ${Number(item.price).toFixed(2)} x {item.quantity}
                      </p>
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeItem(item.itemId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card color-card h-100 shadow-sm p-4">
                <h4 className="mb-3">Order summary</h4>

                <div className="d-flex justify-content-between mb-3">
                  <span>Subtotal</span>
                  <strong>${total.toFixed(2)}</strong>
                </div>

                <div className="d-flex justify-content-between mb-4 text-muted">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <button
                  className="btn btn-wave w-100 btn-lg"
                  onClick={handleCheckout}
                  disabled={checkingOut}
                >
                  {checkingOut ? "Redirecting to checkout..." : "Checkout"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
