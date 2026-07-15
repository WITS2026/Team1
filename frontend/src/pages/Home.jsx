import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import { useAddToCart } from "../hooks/useAddToCart";

function Home() {
  const addToCart = useAddToCart();

  return (
    <>
      <Hero />

      <section className="py-16 px-8">
        <h2 className="text-4xl font-bold text-center mb-12">
          Featured Collection
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} onAddToCart={addToCart} />
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;
