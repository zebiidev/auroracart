import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import FadeLoader from "react-spinners/FadeLoader";

const OrderSummary = ({ shipping }) => {
  const { userCart, cartLoading } = useSelector((state) => state.cart);

  return (
    <div className="w-full">
      <h1 className="md:hidden block font-semibold text-xl my-3">
        Order Summary
      </h1>

      <div className="flex flex-col gap-4">
        {cartLoading ? (
          <FadeLoader />
        ) : userCart && userCart.products.length ? (
          userCart.products.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border-b border-gray-200 pb-3"
            >
              <div className="relative">
                <img
                  className="w-16 h-16 object-cover object-center rounded-md"
                  src={item.image}
                  alt={item.name}
                />
                <span className="absolute flex items-center justify-center text-sm -top-2 -right-2 text-white font-medium rounded-full w-5 h-5 bg-[#707070]">
                  {item.quantity}
                </span>
              </div>

              <div className="flex-1 px-3">
                <div className="text-sm font-medium">{item.name}</div>
                <div className="flex text-sm font-light">
                  <div>{item.color}</div>
                  <span className="px-2">/</span>
                  <div>{item.size}</div>
                </div>
              </div>

              {/* Price */}
              <div className="text-sm font-medium whitespace-nowrap">
                <span className="pr-1">Rs</span>
                {item.price}
              </div>
            </div>
          ))
        ) : (
          <p>No product yet</p>
        )}
      </div>

      {/* Price summary */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-medium text-md">Subtotal</div>
          <div>
            Rs
            {userCart?.products?.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            )}
          </div>
        </div>

        {shipping === "flat" && (
          <div className="flex items-center justify-between">
            <div className="font-medium text-md">Shipping</div>
            <div>Rs250</div>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="w-full flex mt-8 items-center justify-between">
        <div className="font-bold text-2xl">Total</div>
        <div className="text-lg font-semibold">
          Rs
          {(
            userCart?.products?.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            ) + (shipping === "flat" ? 250 : 1)
          ).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
