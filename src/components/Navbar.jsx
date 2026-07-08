import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { getCart } from "../api/cart"; // Adjust path as needed

function Navbar() {
  const [itemCount, setItemCount] = useState(0);
  const location = useLocation();

  // Refresh cart count whenever user navigates to a new page
  useEffect(() => {
    const updateCartCount = async () => {
      try {
        const cartData = await getCart();
        if (cartData && cartData.items) {
          // Sum up total quantity of items in the cart
          const total = cartData.items.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );
          setItemCount(total);
        } else {
          setItemCount(0);
        }
      } catch (error) {
        console.error("Could not fetch cart item count:", error);
      }
    };

    updateCartCount();
  }, [location]); // Triggers on route changes

  return (
    <nav className="bg-black text-white px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-yellow-400">Gemini</h1>

      <div className="flex gap-6">
        <Link to="/" className="hover:text-yellow-400 transition-colors">
          Home
        </Link>
        <Link to="/shop" className="hover:text-yellow-400 transition-colors">
          Shop
        </Link>
        <Link to="/about" className="hover:text-yellow-400 transition-colors">
          About
        </Link>
        <Link to="/contact" className="hover:text-yellow-400 transition-colors">
          Contact
        </Link>
      </div>

      <Link
        to="/cart"
        className="relative p-1 hover:text-yellow-400 transition-colors"
      >
        <ShoppingBag />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Link>
    </nav>
  );
}

export default Navbar;
