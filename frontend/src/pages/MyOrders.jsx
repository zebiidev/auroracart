import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MyOrderss } from "../redux/slices/OrderSlice";
import FadeLoader from "react-spinners/FadeLoader";

const MyOrders = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(MyOrderss());
  }, [dispatch]);

  const { myOrders, myLoading } = useSelector((state) => state.order);

  const isShipping = myOrders?.map((item) => item.shippingMethod);

  console.log(isShipping);

  if (myLoading)
    return (
      <div className="flex items-center justify-center mt-16 text-center">
        <FadeLoader />
      </div>
    );

  return (
    <>
      <h1 className="text-center font-semibold text-3xl mt-6">Your Orders</h1>
      <div className="grid mx-5 grid-cols-1 md:grid-cols-2 my-16 lg:grid-cols-3 overflow-x-hidden gap-4">
        {myOrders && myOrders.length === 0 ? (
          <p>No Orders yet..</p>
        ) : (
          myOrders?.map((order) => (
            <div key={order._id} className="bg-white shadow-md rounded-2xl p-4">
              <div className="flex justify-between items-center w-full mb-2">
                <div>
                  <span className="font-medium px-2">OrderId:</span>
                  <span className="text-xs">#{order._id}</span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="font-medium px-2">Order status: </span>
                <div
                  className={`px-3 py-1 text-sm rounded-full ${
                    order?.status === "Processing"
                      ? "bg-blue-100 text-blue-700"
                      : order?.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order?.status === "Shipped"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </div>
              </div>
              <div className="flex items-center mt-2">
                <h1 className="font-medium px-2">Payment status:</h1>
                <div
                  className={`px-3 py-1 text-sm rounded-full ${
                    order?.paymentStatus === "pending"
                      ? "bg-blue-100 text-blue-700"
                      : order?.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.paymentStatus}
                </div>
              </div>
              <div className="px-3 mt-4 font-bold">Ordered Items</div>
              {order.orderItems?.map((item) => (
                <div className="px-3" key={item.productId}>
                  <div className="flex items-center justify-between">
                    <div className="font-medium pr-2">ProductId</div>
                    <div className="text-sm">{item.productId}</div>
                  </div>
                  <div className="mt-5 gap-1 flex">
                    <img
                      className="w-28 h-28 rounded-md object-cover"
                      src={item.image}
                      alt={item.name}
                    />
                    <div className="flex flex-col w-full justify-between">
                      <div>
                        <div className="text-xs text-gray-600">{item.name}</div>
                        <div className="text-xs text-gray-600">
                          {item.color} / <span>{item.size}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-gray-600">{item.quantity}X</div>
                        <div>
                          {import.meta.env.VITE_CURRENCY}
                          {(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <div className="px-3 mt-4 font-bold">
                  Order Total: {import.meta.env.VITE_CURRENCY}
                  {(
                    order.orderItems?.reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0
                    ) + (order.shippingMethod === "free" ? 0 : 250)
                  ).toFixed(2)}
                </div>
              </div>
              <p className="px-3 text-xs">
                ⚠️ Shipping and taxes are included in the total
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default MyOrders;
