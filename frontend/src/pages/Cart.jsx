import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FadeLoader from "react-spinners/FadeLoader";
import {
  DecreaseCartQuantity,
  DelteItemFromCart,
  IncreseCartQuantity,
} from "../redux/slices/CartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userCart, cartLoading } = useSelector((state) => state.cart);
  const { user, guestId } = useSelector((state) => state.auth);
  const userId = user?._id || null;

  const handleQuantityIncrease = (action, size, productId, color, quantity) => {
    if (action === "plus") {
      dispatch(
        IncreseCartQuantity({
          size,
          productId,
          color,
          userId,
          guestId,
          quantity,
        })
      );
    } else if (action === "minus" && quantity > 1) {
      dispatch(
        DecreaseCartQuantity({
          size,
          productId,
          color,
          userId,
          guestId,
          quantity,
        })
      );
    }
  };

  const handleDelItem = (productId, size, color) => {
    console.log(productId, size, color);
    dispatch(
      DelteItemFromCart({
        userId: userId,
        guestId: guestId,
        productId: productId,
        size: size,
        color: color,
      })
    );
  };

  return (
    <div className="w-full px-4 md:px-12 lg:px-20 py-8">
      <h1 className="text-3xl font-semibold mb-6">Shopping Basket</h1>

      <div className="grid grid-cols-3 md:grid-cols-5 text-xs font-light uppercase text-gray-500 border-b pb-3">
        <span className="col-span-2 md:col-span-3">Product</span>
        <span className="hidden md:block text-center">Quantity</span>
        <span className="text-right">Total</span>
      </div>

      {!(userCart?.products?.length > 0) && (
        <h1 className="w-full text-center py-6 font-medium text-2xl">
          You Cart Is Empty ☹
        </h1>
      )}

      {cartLoading ? (
        <div className="w-full flex items-center justify-center translate-y-11">
          <FadeLoader color="#111" />
        </div>
      ) : (
        userCart?.products?.length > 0 &&
        userCart.products.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-3 md:grid-cols-5 items-center border-b py-6 gap-4"
          >
            <div className="col-span-2 md:col-span-3 flex items-start gap-4 overflow-hidden">
              <img
                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded"
                src={item.image}
                alt={item.name}
              />
              <div className="flex flex-col">
                <h2 className="text-sm md:text-base font-medium">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-600">PKR {item.price}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Color: {item.color}
                </p>
                <p className="text-xs text-gray-500">Size: {item.size}</p>
              </div>
            </div>

            <div className="hidden md:flex justify-center items-center">
              <div className="flex border rounded">
                <button
                  onClick={() =>
                    handleQuantityIncrease(
                      "minus",
                      item.size,
                      item.productId,
                      item.color,
                      item.quantity
                    )
                  }
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-l border-r">
                  {cartLoading ? (
                    <FadeLoader
                      color="#111"
                      height={6}
                      width={2}
                      margin={-4}
                      className="ml-2"
                    />
                  ) : (
                    item.quantity
                  )}
                </span>
                <button
                  onClick={() =>
                    handleQuantityIncrease(
                      "plus",
                      item.size,
                      item.productId,
                      item.color,
                      item.quantity
                    )
                  }
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <button
                onClick={() =>
                  handleDelItem(item.productId, item.size, item.color)
                }
                className="ml-3 text-gray-500 hover:text-red-500"
              >
                <RiDeleteBin6Line size={18} />
              </button>
            </div>

            <div className="text-right text-sm md:text-base">
              PKR {(item.price * item.quantity).toFixed(2)}
            </div>

            <div className="col-span-3 flex justify-between items-center md:hidden mt-2">
              <div className="flex border rounded">
                <button
                  onClick={() =>
                    handleQuantityIncrease(
                      "minus",
                      item.size,
                      item.productId,
                      item.color,
                      item.quantity
                    )
                  }
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-l border-r">
                  {cartLoading ? (
                    <FadeLoader
                      color="#111"
                      height={6}
                      width={2}
                      margin={-4}
                      className="ml-2"
                    />
                  ) : (
                    item.quantity
                  )}
                </span>
                <button
                  onClick={() =>
                    handleQuantityIncrease(
                      "plus",
                      item.size,
                      item.productId,
                      item.color,
                      item.quantity
                    )
                  }
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <button
                onClick={() =>
                  handleDelItem(item.productId, item.size, item.color)
                }
                className="text-gray-500 hover:text-red-500"
              >
                <RiDeleteBin6Line size={18} />
              </button>
            </div>
          </div>
        ))
      )}

      <div className="flex flex-col items-end mt-6 gap-2">
        <div className="text-lg font-semibold flex items-center gap-2">
          <span>Subtotal:</span>
          {cartLoading ? (
            <FadeLoader
              color="#111"
              height={6}
              width={2}
              margin={-4}
              className="ml-2"
            />
          ) : (
            // <span className="ml-2">PKR {userCart?.totalPrice?.toFixed(2)}</span>
            <span className="ml-2">
              {userCart?.products
                ?.reduce((acc, item) => acc + item.price * item.quantity, 0)
                .toFixed(2)}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500">
          Taxes and shipping calculated at checkout
        </p>

        <button
          disabled={!userCart?.products.length}
          onClick={() => navigate("/checkout")}
          className={`w-full md:w-64 bg-black text-white py-3 text-sm mt-3 
  hover:bg-gray-900 ${
    !userCart?.products?.length ? "cursor-not-allowed " : ""
  }`}
        >
          CHECK OUT
        </button>
        <button
          onClick={() => navigate("/collection")}
          className="w-full md:w-64 border border-black py-3 text-sm hover:bg-gray-100"
        >
          CONTINUE SHOPPING
        </button>
      </div>
    </div>
  );
};

export default Cart;
