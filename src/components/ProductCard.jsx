import React from "react";

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="border p-4 rounded-lg shadow-md flex flex-col justify-between bg-white">
      <div>
        {product.image && (
          <img
            src={product.image}
            alt={product.name || product.title}
            className="w-full h-48 object-cover rounded mb-4"
          />
        )}
        <h3 className="font-bold text-xl mb-2">
          {product.name || product.title}
        </h3>
        <p className="text-gray-700 text-lg mb-4">${product.price}</p>
      </div>
      <button
        onClick={() => {
          if (onAddToCart) onAddToCart(product);
        }}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
