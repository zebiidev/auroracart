import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ CardData, toggleSearchBar }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-4  gap-6">
      <div
        key={CardData.id}
        onClick={() => {
          navigate(`/product-detail/${CardData._id}`);
          toggleSearchBar();
        }}
        className="w-full  cursor-pointer group"
      >
        <div className="overflow-hidden">
          <img
            className="w-full h-[350px] rounded-md object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
            src={CardData.images[0].url}
            alt={CardData.name}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="mt-2 font-normal text-sm sm:text-base">
          {CardData.name}
        </div>
        <div>
          <span className="line-through">{CardData.price}</span>
          {import.meta.env.VITE_CURRENCY} {CardData.discountPrice}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
