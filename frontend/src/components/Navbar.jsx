import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { getCart } from "../api/cart";

function Navbar() {
  const [itemCount, setItemCount] = useState(0);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const updateCartCount = async () => {
    try {
      const cart = await getCart();
      const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setItemCount(total);
    } catch (error) {
      setItemCount(0);
    }
  };

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  useEffect(() => {
    updateCartCount();
  }, [location]);

  useEffect(() => {
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  useEffect(() => {
    loadUser();
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedIn" || payload.event === "signedOut") {
        loadUser();
        updateCartCount();
      }
    });

    return unsubscribe;
  }, []);

  return (
    <nav className="bg-[rgba(0,0,0,0.82)] backdrop-blur-xl px-6 py-4 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 border-b border-[rgba(255,255,255,0.08)] shadow-[0_20px_65px_rgba(0,0,0,0.18)]">
      <Link to="/" className="flex items-center gap-3 no-underline">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#dcb767] to-[#f4e4bd] text-black shadow-[0_0_24px_rgba(220,183,103,0.24)]">
          <span className="text-lg font-black tracking-[0.35em]">G</span>
        </div>
        <div>
          <h1 className="text-2xl font-semibold uppercase tracking-[0.25em] text-[#f8e5b7]">Gemini</h1>
          <p className="text-xs uppercase tracking-[0.35em] text-[#c9b28b]">Fine Jewelry</p>
        </div>
      </Link>

      <div className="flex flex-wrap items-center gap-6 text-sm uppercase tracking-[0.16em] text-[#d8c4a3]">
        <Link to="/" className="transition-colors hover:text-[#f8e6b0]">Home</Link>
        <Link to="/shop" className="transition-colors hover:text-[#f8e6b0]">Shop</Link>
        <Link to="/about" className="transition-colors hover:text-[#f8e6b0]">About</Link>
        <Link to="/contact" className="transition-colors hover:text-[#f8e6b0]">Contact</Link>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="hidden md:flex items-center gap-3 text-xs text-[#d8c4a3]">
            <span>Welcome, {user.signInDetails?.loginId || user.username}</span>
            <button onClick={handleSignOut} className="text-[#f8e6b0] hover:text-white transition-colors">
              Sign out
            </button>
          </div>
        )}

        <Link
          to="/cart"
          className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#f8e6b0] transition hover:border-[#dcb767] hover:text-[#fff7e5]"
        >
          <ShoppingBag />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#dcb767] text-[10px] font-bold text-black">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;