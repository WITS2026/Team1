import React from "react";

function ProductCard({ product, onAddToCart }) {
  const imageSrc = product.image || product.imageUrl;

  return (
    <div className="product-card rounded-[28px] overflow-hidden flex flex-col justify-between">
      {imageSrc && (
        <div className="relative overflow-hidden bg-black/10">
          <img src={imageSrc} alt={product.name || product.title} className="w-full h-64 object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      )}

      <div className="p-6 flex flex-col gap-5">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#c9b18a] mb-3">{product.category || "Fine Jewelry"}</p>
          <h3 className="text-2xl font-semibold text-white mb-3">{product.name || product.title}</h3>
          <p className="text-lg font-semibold text-[#ddb76f] mb-4">${Number(product.price).toFixed(2)}</p>
          <p className="text-sm leading-relaxed text-[#c9b18a]">
            {product.description || "A premium design crafted for modern elegance."}
          </p>
        </div>

        <button
          onClick={() => {
            if (onAddToCart) onAddToCart(product);
          }}
          className="btn-gold w-full rounded-full py-3 text-sm font-semibold uppercase tracking-[0.2em]"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
