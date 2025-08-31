import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-full">
      <div className="flex items-center justify-center relative">
        <img
          className="w-full hidden md:block z-0"
          style={{
            height: "calc(100vh - 1px)",
            objectFit: "cover",
            objectPosition: "center",
          }}
          src={assets.hero}
          alt="hero image"
        />

        <img
          className="md:hidden min-h-screen block z-0"
          style={{
            height: "calc(100vh - 1px)",
            objectFit: "cover",
            objectPosition: "center",
          }}
          src={assets.mobile_hero}
          alt="hero image"
        />
      </div>
    </div>
  );
};

export default Hero;
