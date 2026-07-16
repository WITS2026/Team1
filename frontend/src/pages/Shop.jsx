import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { useAddToCart } from "../hooks/useAddToCart";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const addToCart = useAddToCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Error getting products:", error);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="container my-5">
      <div className="page-section">
        <h1 className="mb-4 text-primary text-center">Shop</h1>

        <div className="row">
          {products.map((product) => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div className="card color-card h-100 shadow-sm text-center">
                <div className="color-card-top"></div>

                <div className="card-body">
                  <h5>{product.title}</h5>
                  <p className="text-muted mb-4">
                    ${Number(product.price).toFixed(2)}
                  </p>

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
    </div>
  );
}
