import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
import FadeLoader from "react-spinners/FadeLoader";

const OrderDetailPopUp = ({ setShowPopup, detailLoading, orderDetails }) => {
  const popRef = useRef(null);

  const hndleClickOutside = (e) => {
    if (popRef.current && !popRef.current.contains(e.target)) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", hndleClickOutside);
    return () => document.removeEventListener("mousedown", hndleClickOutside);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        ref={popRef}
        className="relative lg:w-[60vw] md:w-[70vw] max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-xl p-6"
      >
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Order Details
        </h2>

        {detailLoading ? (
          <div className="flex justify-center items-center py-10">
            <FadeLoader />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">Order ID:</span>
              <span className="text-gray-800">{orderDetails?._id || "—"}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">Order Date:</span>
              <span className="text-gray-800">
                {orderDetails?.createdAt
                  ? new Date(orderDetails.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">Total:</span>
              <span className="text-gray-800">
                PKR {orderDetails?.totalPrice || "—"}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">Payment Status:</span>
              <span
                className={`px-3 py-1 text-sm rounded-full  ${
                  orderDetails?.paymentStatus === "pending"
                    ? "bg-blue-100 text-blue-700"
                    : orderDetails?.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {orderDetails?.paymentStatus || ""}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">Order Status:</span>
              <span
                className={`px-3 py-1 text-sm rounded-full  ${
                  orderDetails?.status === "Processing"
                    ? "bg-blue-100 text-blue-700"
                    : orderDetails?.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : orderDetails?.status === "Shipped"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {orderDetails?.status || ""}
              </span>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
              User Details
            </h2>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">User Id:</span>
              <span className="text-gray-800">
                {orderDetails?.user._id || "—"}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">User name:</span>
              <span className="text-gray-800">
                {orderDetails?.user?.firstName || "—"}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">Registered At:</span>
              <span className="text-gray-800">
                {orderDetails?.user?.createdAt
                  ? new Date(orderDetails.user.createdAt).toLocaleString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600">User email</span>
              <span className="text-gray-800">
                {orderDetails?.user?.email || "—"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPopUp;
