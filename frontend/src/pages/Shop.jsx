import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { addToCart } from "../api/cart";

function Shop() {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Updated to include the literal "{itemId}" text required by your API layout
        const response = await fetch("https://vcy5fudxq3.execute-api.us-east-1.amazonaws.com/product/%7BitemId%7D");
        
        if (!response.ok) {
          throw new Error("Failed to fetch shop items");
        }
        
        const data = await response.json();
        
        // Hoppscotch shows the root response is a direct JSON array `[`
        setProductsList(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Could not load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      //alert(`${product.name || product.title} added to cart!`);
      
      // Dispatch the custom event to tell the Navbar to fetch the fresh count instantly!
      window.dispatchEvent(new Event("cartUpdated"));
      
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      alert("Could not add item to cart.");
    }
  };

  if (loading) return <div className="text-center p-8 text-xl">Loading products...</div>;
  if (error) return <div className="text-center p-8 text-red-500 text-xl">{error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Shop Jewelry</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {productsList && productsList.length > 0 ? (
          productsList.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onAddToCart={handleAddToCart}
            />
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
}

export default Shop;