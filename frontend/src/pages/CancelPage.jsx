import React from "react";
import { XCircle } from "lucide-react";

const CancelPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <XCircle className="mx-auto text-red-500" size={80} />
        <h1 className="text-3xl font-bold text-red-600 mt-4">Payment Failed</h1>
        <p className="text-gray-600 mt-2">
          Your payment could not be processed or was canceled. Please try again
          or use a different payment method.
        </p>
        <a
          href="/checkout"
          className="mt-6 inline-block bg-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-red-600 transition"
        >
          Try Again
        </a>
      </div>
    </div>
  );
};

export default CancelPage;
