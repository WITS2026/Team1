import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <div className="container mx-auto px-6 py-20">
      <div className="page-section mx-auto max-w-2xl p-10 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-[#c9b18a] mb-4">Order confirmed</p>
        <h1 className="text-4xl font-semibold text-white mb-4">Thank you for your order!</h1>
        <p className="text-[#b8aa97] mb-8">
          Your payment was successful. A confirmation has been sent to your email.
        </p>
        <Link to="/shop" className="btn-gold inline-flex rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em]">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
