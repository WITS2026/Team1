import React from "react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import { addToCart } from "../api/cart";

function Shop() {
  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      alert(`${product.name || product.title} added to cart!`);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      alert("Could not add item to cart.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Shop Jewelry</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products &&
          products.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onAddToCart={handleAddToCart}
            />
          ))}
      </div>
    </div>
  );
}

export default Shop;
