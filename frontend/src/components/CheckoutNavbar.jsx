import React from "react";
import { IoBagHandleOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

const CheckoutNavbar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full border-b flex items-center h-24  px-6 md:px-[100px] justify-between">
      <div className="">
        <a href="/" className="logo md:text-3xl text-xl">
          AURORACART
        </a>
      </div>
      <div className="flex items-center gap-11">
        <div className="relative group">
          <Link to="/my-orders" className="relative">
            My orders
            <span className="absolute left-0 -bottom-1 w-full h-[2px]  bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>
        </div>

        <div className=" text-blue-400  text-lg cursor-pointer md:text-3xl">
          <IoBagHandleOutline onClick={() => navigate("/cart")} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutNavbar;
