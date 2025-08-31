import React from "react";
import { assets } from "../assets/assets";
import Title from "./Title";

const MenWomen = () => {
  return (
    <>
      <Title title="Explore Man & Woman Collection" />
      <div className="w-full mb-5 h-full translate-y-8 flex flex-col lg:flex-row overflow-x-hidden">
        {/* Women Collection */}
        <div className="relative lg:w-1/2 mx-5 mb-5">
          <img
            className="w-full h-[70vh] md:h-[100vh] object-cover cursor-pointer rounded-md"
            src={assets.women_collection}
            alt="Woman Collection"
            loading="lazy"
          />
          <div className="bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center text-black absolute left-3 bottom-14 w-[250px] rounded-md h-32 shadow-md">
            <h1 className="font-medium">Explore Woman Collection</h1>
            <a className="underline" href="/collection">
              Shop Now
            </a>
          </div>
        </div>

        {/* Men Collection */}
        <div className="relative lg:w-1/2 mx-5 mb-5">
          <img
            className="w-full h-[70vh] md:h-[100vh] object-cover cursor-pointer rounded-md"
            src={assets.man_collection}
            alt="Man Collection"
            loading="lazy"
          />
          <div className="bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center text-black absolute left-3 bottom-14 w-[250px] rounded-md h-32 shadow-md">
            <h1 className="font-medium">Explore Man Collection</h1>
            <a className="underline" href="/collection">
              Shop Now
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenWomen;
