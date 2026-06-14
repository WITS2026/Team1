function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition">
      <img
        src={product.image}
        alt={product.name}
        className="h-72 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="font-bold text-xl">{product.name}</h3>

        <p className="text-yellow-600 font-semibold">${product.price}</p>

        <button className="w-full mt-4 bg-black text-white py-2 rounded">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
