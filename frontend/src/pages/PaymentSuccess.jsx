import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <div className="container my-5 text-center py-5">
      <h1 className="text-primary mb-3">Thank you for your order!</h1>
      <p className="text-muted mb-4">
        Your payment was successful. A confirmation has been sent to your
        email.
      </p>
      <Link to="/shop" className="btn btn-wave btn-lg">
        Continue Shopping
      </Link>
    </div>
  );
}
