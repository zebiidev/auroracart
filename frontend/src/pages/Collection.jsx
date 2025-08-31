import React, { useEffect, useRef, useState } from "react";
import Title from "../components/Title";
import { CiFilter } from "react-icons/ci";
import ProductCard from "../components/ProductCard";
import FiltersDrawer from "../components/FiltersDrawer";
import { useDispatch, useSelector } from "react-redux";
import { GetAllProducts } from "../redux/slices/ProductSlice";
import FadeLoader from "react-spinners/FadeLoader";

const Collection = () => {
  const [openFilter, setOpenFilters] = useState(false);
  const [price, setPrice] = useState("default");
  const filterRef = useRef();

  const dispatch = useDispatch();
  const { products, filtered, loading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(GetAllProducts());
  }, [dispatch]);

  const toggleFilterDrawer = () => setOpenFilters(!openFilter);

  const handleClickOutside = (e) => {
    if (filterRef.current && !filterRef.current.contains(e.target)) {
      setOpenFilters(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let displayProducts =
    filtered && filtered.length !== 0 ? [...filtered] : [...(products || [])];

  if (price === "low-to-high") {
    displayProducts = [...displayProducts].sort((a, b) => a.price - b.price);
  } else if (price === "high-to-low") {
    displayProducts = [...displayProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="w-full overflow-x-hidden relative">
      <Title title="All Collections" />

      {/* Filters + Sort */}
      <div className="w-full flex items-center justify-between px-5">
        <div
          onClick={toggleFilterDrawer}
          className="flex items-center gap-2 cursor-pointer hover:underline"
        >
          <CiFilter />
          <h1>Filters</h1>
        </div>
        <div>
          <span className="font-medium text-black text-sm pl-6">Sort by:</span>
          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 cursor-pointer ml-2 text-sm focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
            name="sortByPrice"
            id="sortByPrice"
          >
            <option value="default">Default</option>
            <option value="low-to-high">Low to High</option>
            <option value="high-to-low">High to Low</option>
          </select>
        </div>
      </div>

      {/* Filters Drawer + Product Grid */}
      <div className="flex mt-5">
        <div
          ref={filterRef}
          className={`
            bg-white border-r md:border-t overflow-y-auto z-[1000]
            fixed top-0 left-0 bottom-0 w-[70vw] 
            transform transition-transform duration-500
            md:static md:w-[30vw] md:overflow-y-auto md:translate-x-0
            ${
              openFilter
                ? "translate-x-0"
                : "-translate-x-full md:block md:overflow-y-auto"
            }
          `}
        >
          <FiltersDrawer toggleFilterDrawer={toggleFilterDrawer} />
        </div>
        <div
          className={`
    grid flex-1 gap-4 px-5
    grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3
    items-start
  `}
        >
          {loading ? (
            <div className="flex justify-center items-center w-full pt-16">
              <FadeLoader />
            </div>
          ) : displayProducts.length > 0 ? (
            displayProducts.map((CardData) => (
              <ProductCard key={CardData._id} CardData={CardData} />
            ))
          ) : (
            <p className="text-center w-full pt-16">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
