import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllProducts } from "../redux/slices/ProductSlice";
import FadeLoader from "react-spinners/FadeLoader";

// Components
import MenWomen from "../components/MenWomen";
import YouMayLike from "../components/YouMayLike";
import NewsLetter from "../components/NewsLetter";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(GetAllProducts());
    }
  }, [dispatch, products]);

  return (
    <div className="pt-[100vh]">
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <FadeLoader />
        </div>
      ) : (
        <>
          <MenWomen />
          <YouMayLike />
          <NewsLetter />
        </>
      )}
    </div>
  );
};

export default Home;
