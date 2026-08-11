import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/products";
import { useAddToCart } from "../hooks/useAddToCart";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [materialFilter, setMaterialFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const addToCart = useAddToCart();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts({
          category: categoryFilter,
          search: searchTerm,
          material: materialFilter,
          price: priceFilter,
        });
        setProducts(data || []);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    }

    loadProducts();
  }, [categoryFilter, searchTerm, materialFilter, priceFilter]);

  const filteredProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case "az":
        return String(a.title || "").localeCompare(String(b.title || ""));
      case "za":
        return String(b.title || "").localeCompare(String(a.title || ""));
      case "low":
        return Number(a.price || 0) - Number(b.price || 0);
      case "high":
        return Number(b.price || 0) - Number(a.price || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="page-section rounded-[2rem] p-8 mb-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">Shop the Collection</h1>
            <p className="mt-3 max-w-2xl text-[#b8aa97]">Handpicked jewelry crafted for timeless elegance. Filter by category, material, or price to find your perfect piece.</p>
          </div>
          <div className="text-sm uppercase tracking-[0.25em] text-[#c9b18a]">{filteredProducts.length} items available</div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            type="search"
            className="form-input"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select className="form-input" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Rings">Rings</option>
            <option value="Necklaces">Necklaces</option>
            <option value="Bracelets">Bracelets</option>
            <option value="Earrings">Earrings</option>
          </select>

          <select className="form-input" value={materialFilter} onChange={(e) => setMaterialFilter(e.target.value)}>
            <option value="all">All Materials</option>
            <option value="14K Gold">14K Gold</option>
            <option value="Sterling Silver">Sterling Silver</option>
            <option value="Platinum">Platinum</option>
          </select>

          <select className="form-input" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
            <option value="all">All Prices</option>
            <option value="low">Under $100</option>
            <option value="medium">$100-$500</option>
            <option value="high">$500+</option>
          </select>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span className="text-sm uppercase tracking-[0.2em] text-[#c9b18a]">Sort by</span>
          <select className="form-input max-w-xs" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="default">Default</option>
            <option value="az">Name A-Z</option>
            <option value="za">Name Z-A</option>
            <option value="low">Price Low → High</option>
            <option value="high">Price High → Low</option>
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-[#b8aa97]">No products found.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={{ ...product, image: product.image || product.imageUrl }} onAddToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
