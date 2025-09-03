import React from "react";
import { IoClose } from "react-icons/io5";
import { MdOutlineDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";
import { DelteItemFromCart } from "../redux/slices/CartSlice";

const CartDrawer = ({ toggleCartDrawer }) => {
  const { userCart, cartLoading } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCartDrawer();

    if (!user) {
      navigate("/login");
    }
    navigate("/checkout");
  };

  const dipatch = useDispatch();

  const { user, guestId } = useSelector((state) => state.auth);

  const userId = user?._id || null;

  const handleCartItemDelete = (productId, size, color) => {
    dipatch(DelteItemFromCart({ productId, size, color, userId, guestId }));
  };

  return (
    <div className="relative h-full border-l z-[999] border-black p-6 overflow-y-auto">
      {/* Close button */}
      <div
        onClick={toggleCartDrawer}
        className="absolute text-3xl p-4 cursor-pointer text-black right-0 top-0"
      >
        <IoClose />
      </div>

      <h1 className="uppercase font-medium md:text-xl">
        {userCart && userCart.products?.length > 0
          ? "Added to your cart"
          : "Your cart is empty"}
      </h1>

      {cartLoading ? (
        <FadeLoader color="#111" />
      ) : userCart && userCart.products?.length > 0 ? (
        userCart.products.map((item, idx) => (
          <div key={idx} className="flex mt-6">
            {/* Product Image */}
            <Link onClick={toggleCartDrawer} to="/cart">
              {" "}
              <img
                className="w-24 h-28 rounded-md object-cover"
                src={item.image}
                alt={item.name}
              />
            </Link>

            {/* Product Details */}
            <div className="flex flex-col justify-between flex-1 ml-3">
              {/* Top Row: Name, Color/Size, Delete */}
              <div className="flex justify-between">
                <Link onClick={toggleCartDrawer} to="/cart">
                  <div className="uppercase text-xs md:text-md">
                    {item.name}
                  </div>
                  <span className="px-1 text-sm text-gray-500">
                    {item.color}
                  </span>
                  <span className="text-sm text-gray-500">/</span>
                  <span className="px-1 text-sm text-gray-500">
                    {item.size}
                  </span>
                </Link>

                <MdOutlineDelete
                  onClick={() =>
                    handleCartItemDelete(
                      item.productId,
                      item.size,
                      item.color,
                      item.quantity
                    )
                  }
                  className="text-2xl cursor-pointer text-gray-400 "
                />
              </div>

              {/* Bottom Row: Quantity + Price */}
              <div className="flex justify-between">
                <div className="text-gray-500 text-md">{item.quantity}X</div>
                <div className="text-sm font-normal">
                  {import.meta.env.VITE_CURRENCY}
                  <span>{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p></p>
      )}

      {/* Divider */}
      <hr className="mt-6 border-t border-black" />

      {/* Total */}
      <div className="flex items-center justify-end">
        <span className="text-sm"> TOTAL:</span>
        <div className="text-sm pl-1 font-normal">
          {import.meta.env.VITE_CURRENCY}{" "}
          <span>{userCart?.totalPrice.toFixed(2) || 0}</span>
        </div>
      </div>

      {/* Note */}
      <p className="text-[10px] tracking-tighter max-w-full mt-4">
        *ALL ORDERS MAY TAKE UPTO 7 WORKING DAYS TO BE DELIVERED TO YOUR
        DOORSTEP
      </p>

      {/* Checkout Button */}
      <button
        disabled={!(userCart?.products?.length > 0)}
        onClick={handleCheckout}
        className={`w-full bg-black text-white py-2 font-light mt-4 hover:bg-black/90 ${
          !(userCart?.products?.length > 0)
            ? "bg-black/90 cursor-not-allowed"
            : ""
        }`}
      >
        CHECK OUT
      </button>
    </div>
  );
};

export default CartDrawer;
