import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/products";
import { useAddToCart } from "../hooks/useAddToCart";
import { Link } from "react-router-dom";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useAddToCart();

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await getProducts();
        setFeaturedProducts((data || []).slice(0, 6));
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFeatured();
  }, []);

  return (
    <>
      <Hero />

      <section className="container mx-auto px-6 py-14">
        <div className="page-section rounded-[2rem] p-10">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-[#c9b18a] mb-4">Featured Collection</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">Discover elegant designs for every moment.</h2>
            <p className="mt-4 text-[#b8aa97] max-w-2xl mx-auto">
              Explore our hand-curated selection of jewelry crafted to feel luxurious and unforgettable.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-[#b8aa97]">Loading featured products…</p>
          ) : featuredProducts.length === 0 ? (
            <p className="text-center text-[#b8aa97]">No featured products available right now.</p>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-3">
                {featuredProducts.map((item) => (
                  <ProductCard key={item.id} product={item} onAddToCart={addToCart} />
                ))}
              </div>

              <div className="mt-10 flex justify-center">
                <Link
                  to="/shop"
                  className="inline-block bg-[#c9b18a] text-black font-semibold px-6 py-3 rounded-full hover:opacity-90"
                  aria-label="See more products"
                >
                  See more
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
