import React from "react";
import { IoBagHandleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const CheckoutNavbar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full border-b flex items-center h-24  px-6 md:px-[100px] justify-between">
      <div className="">
        <a href="/" className="logo md:text-3xl text-xl">
          AURORACART
        </a>
      </div>
      <div className=" text-blue-400  text-lg cursor-pointer md:text-3xl">
        <IoBagHandleOutline onClick={() => navigate("/cart")} />
      </div>
    </div>
  );
};

export default CheckoutNavbar;
