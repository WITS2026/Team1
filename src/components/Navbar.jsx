import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

function Navbar() {
  return (
    <nav className="bg-black text-white px-8 py-4 flex justify-between">
      <h1 className="text-2xl font-bold text-yellow-400">Gemini</h1>

      <div className="flex gap-6">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>

      <Link to="/cart">
        <ShoppingBag />
      </Link>
    </nav>
  );
}

export default Navbar;
