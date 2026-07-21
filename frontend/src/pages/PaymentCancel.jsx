import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div className="container my-5 text-center py-5">
      <h1 className="mb-3">Checkout canceled</h1>
      <p className="text-muted mb-4">
        Your payment was canceled and you have not been charged. Your cart is
        still saved.
      </p>
      <Link to="/cart" className="btn btn-outline-danger btn-lg">
        Return to Cart
      </Link>
    </div>
  );
}
