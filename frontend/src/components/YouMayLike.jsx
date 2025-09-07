import React, { useMemo } from "react";
import Title from "./Title";
import ProductCard from "./ProductCard";
import FadeLoader from "react-spinners/FadeLoader";
import { useSelector } from "react-redux";

const YouMayLike = () => {
  const { products, loading } = useSelector((state) => state.product);

  const suggestedProducts = useMemo(() => products.slice(0, 8), [products]);

  return (
    <div className="max-w-full mt-7 mx-5">
      <div className="translate-y-7">
        <Title title="You may like" />
      </div>

      <div className="grid grid-cols-1 w-full translate-y-7 relative sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center min-h-[70vh]">
            <FadeLoader color="#111" />
          </div>
        ) : (
          suggestedProducts.map((card) => (
            <ProductCard key={card._id} CardData={card} />
          ))
        )}
      </div>
    </div>
  );
};

export default YouMayLike;
