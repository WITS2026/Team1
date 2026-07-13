import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { getCart } from "../api/cart";

function Navbar() {
  const [itemCount, setItemCount] = useState(0);
  const location = useLocation();

  // Unified function to hit your AWS endpoint and calculate the count
  const updateCartCount = async () => {
    try {
      const cart = await getCart();
      const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setItemCount(total);
    } catch (error) {
      // Not signed in yet, or request failed - show no badge rather than erroring.
      setItemCount(0);
    }
  };

  // 1. Fetch count whenever the user changes pages (Home -> Shop -> About, etc.)
  useEffect(() => {
    updateCartCount();
  }, [location]); 

  // 2. Isolated listener: Stays active permanently and handles instant "Add to Cart" pings
  useEffect(() => {
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []); // Empty array means this runs ONCE on app load and stays active

  return (
    <nav className="bg-black text-white px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-yellow-400">Gemini</h1>

      <div className="flex gap-6">
        <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
        <Link to="/shop" className="hover:text-yellow-400 transition-colors">Shop</Link>
        <Link to="/about" className="hover:text-yellow-400 transition-colors">About</Link>
        <Link to="/contact" className="hover:text-yellow-400 transition-colors">Contact</Link>
      </div>

      <Link to="/cart" className="relative p-1 hover:text-yellow-400 transition-colors">
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