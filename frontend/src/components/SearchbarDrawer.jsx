import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import ProductCard from "./ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { SearchedProducts } from "../redux/slices/ProductSlice";
import FadeLoader from "react-spinners/FadeLoader";
import { toast } from "react-toastify";

const SearchbarDrawer = ({ toggleSearchBar }) => {
  const dispatch = useDispatch();
  const { productsSearched, loading, count, products } = useSelector(
    (state) => state.product
  );

  const [inputValue, setInputValue] = useState("");
  const [searching, setSearching] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === "") {
      setSearching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      return toast.error("Add at least 4 to 5 characters for search");
    }

    dispatch(SearchedProducts(inputValue));
    setSearching(true);
  };

  const productsToShow = searching
    ? productsSearched || []
    : products?.slice(8, 12) || [];

  return (
    <div className="bg-white h-[100vh] p-6 z-50 overflow-y-auto max-w-full">
      {/* Close button */}
      <div
        onClick={toggleSearchBar}
        className="flex text-2xl justify-end cursor-pointer"
      >
        <IoClose />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative flex items-center justify-between w-full"
      >
        <div className="relative w-full">
          <input
            id="search"
            value={inputValue}
            onChange={handleChange}
            className="peer w-full  md:py-4 text-lg py-2 bg-transparent outline-none border-b border-b-black"
            placeholder=" "
            type="text"
          />
          <label
            htmlFor="search"
            className={`absolute left-0 transition-all duration-300 ease-in-out
              ${
                inputValue
                  ? "top-[-10px] text-sm text-gray-700"
                  : "top-5 text-xl text-gray-500 peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-700"
              }`}
          >
            Enter search terms
          </label>
        </div>

        <button type="submit" className="-translate-x-6 pt-5">
          <CiSearch className="cursor-pointer md:text-[35px] text-[20px]" />
        </button>
      </form>

      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <h1 className="mt-9 text-xl">
          {searching ? "Searched Products" : "Suggested for you"}
        </h1>
        {searching && count > 0 && (
          <div className="text-gray-600 tracking-tighter pt-9 text-sm">
            Showing {count} results
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center mt-16">
            <FadeLoader />
          </div>
        ) : searching &&
          (!productsSearched || productsSearched.length === 0) ? (
          <div className="col-span-full text-center text-gray-600 mt-16">
            No product found ☹
          </div>
        ) : (
          productsToShow.map((card, idx) => (
            <ProductCard
              toggleSearchBar={toggleSearchBar}
              key={idx}
              CardData={card}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchbarDrawer;
