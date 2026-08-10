import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { useAddToCart } from "../hooks/useAddToCart";

export default function Shop() {
  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");
  const [materialFilter, setMaterialFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  console.log({
    categoryFilter,
    colorFilter,
    materialFilter,
    priceFilter,
  });

  const addToCart = useAddToCart();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts({
          category: categoryFilter,
          search: searchTerm,
          color: colorFilter,
          material: materialFilter,
          price: priceFilter,
        });

        console.log("FROM LAMBDA:", data);

        setProducts(data || []);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    }

    loadProducts();
  }, [categoryFilter, searchTerm, colorFilter, materialFilter, priceFilter]);

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
    <div className="container my-5">
      <h1 className="text-center text-primary mb-4">
        Shop ({products.length} products)
      </h1>

      <input
        className="form-control mb-3"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="row mb-3">
        <div className="col-md-3">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Rings">Rings</option>
            <option value="Necklaces">Necklaces</option>
            <option value="Bracelets">Bracelets</option>
            <option value="Earrings">Earrings</option>
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
          >
            <option value="all">All Colors</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Rose Gold">Rose Gold</option>
            <option value="White">White</option>
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={materialFilter}
            onChange={(e) => setMaterialFilter(e.target.value)}
          >
            <option value="all">All Materials</option>
            <option value="14K Gold">14K Gold</option>
            <option value="Sterling Silver">Sterling Silver</option>
            <option value="Platinum">Platinum</option>
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="low">Under $100</option>
            <option value="medium">$100-$500</option>
            <option value="high">$500+</option>
          </select>
        </div>
      </div>

      <select
        className="form-select mb-4"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="default">Sort By</option>
        <option value="az">Name A-Z</option>
        <option value="za">Name Z-A</option>
        <option value="low">Price Low → High</option>
        <option value="high">Price High → Low</option>
      </select>

      <div className="row">
        {filteredProducts.length === 0 && (
          <p className="text-center text-muted">No products found.</p>
        )}

        {filteredProducts.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card shadow-sm h-100 text-center">
              <div className="card-body">
                <h5>{product.title}</h5>

                <p>${Number(product.price).toFixed(2)}</p>

                <button
                  className="btn btn-wave"
                  onClick={() => addToCart(product)}
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
