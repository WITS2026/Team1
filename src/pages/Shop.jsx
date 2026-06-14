import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

function Shop() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Shop Jewelry</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}

export default Shop;
