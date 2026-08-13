import { useNavigate } from "react-router-dom";
import { addToCart as addToCartRequest } from "../api/cart";
import { isSignedIn } from "../api/config";
import { useSnackbar } from "../context/SnackbarContext";

export function useAddToCart() {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  return async function addToCart(product) {
    if (!(await isSignedIn())) {
      navigate("/cart");
      return;
    }

    try {
      await addToCartRequest(product);
      window.dispatchEvent(new Event("cartUpdated"));
      showSnackbar(`${product.title || product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      showSnackbar("There was a problem adding this item. Please try again.", "error");
    }
  };
}
