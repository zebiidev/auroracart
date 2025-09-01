import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-lg w-full text-center">
        <CheckCircle2 className="mx-auto text-green-500 w-20 h-20 mb-6 animate-bounce" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase! Your payment has been processed
          successfully. You’ll receive a confirmation email with the order
          details soon.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition"
          >
            Back to Home
          </Link>
          <Link
            to="/my-orders"
            className="px-6 py-3 rounded-xl border border-green-500 text-green-600 font-medium hover:bg-green-50 transition"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
