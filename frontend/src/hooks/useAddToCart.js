import { useNavigate } from "react-router-dom";
import { addToCart as addToCartRequest } from "../api/cart";
import { isSignedIn } from "../api/config";

export function useAddToCart() {
  const navigate = useNavigate();

  return async function addToCart(product) {
    if (!(await isSignedIn())) {
      navigate("/cart");
      return;
    }

    try {
      await addToCartRequest(product);
      window.dispatchEvent(new Event("cartUpdated"));
      alert(`${product.title || product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("There was a problem adding this item. Please try again.");
    }
  };
}
