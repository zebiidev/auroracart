import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { GetSingleProduct } from "../redux/slices/ProductSlice";
import FadeLoader from "react-spinners/FadeLoader";
import { AddtoCart } from "../redux/slices/CartSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const [mainImage, setMainImage] = useState();
  const [selectedSize, setSize] = useState("");
  const [selectedColor, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { singleProduct, loading } = useSelector((state) => state.product);
  const { user, guestId } = useSelector((state) => state.auth);
  const { addcartLoading } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const _id = user ? user._id : guestId;

  useEffect(() => {
    dispatch(GetSingleProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (singleProduct?.images?.length > 0) {
      setMainImage(singleProduct.images[0].url);
    }
  }, [singleProduct]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleQuantity = (action) => {
    if (action === "plus") {
      setQuantity((prev) => prev + 1);
    } else if (action === "minus" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleCartSubmit = () => {
    if (!selectedColor || !selectedSize) {
      return toast.error("Please select size and color");
    }

    dispatch(
      AddtoCart({
        size: selectedSize,
        color: selectedColor,
        quantity,
        productId: id,
        userId: user && user._id,
        guestId: _id,
      })
    );
  };
  const normalizeSizes = (sizes) => {
    if (!sizes) return [];
    if (Array.isArray(sizes)) {
      if (sizes.length === 1 && sizes[0].includes(",")) {
        return sizes[0].split(",").map((s) => s.trim());
      }
      return sizes;
    }
    return sizes.split(",").map((s) => s.trim());
  };

  const normalizeColors = (colors) => {
    if (!colors) return [];
    if (Array.isArray(colors)) {
      if (colors.length === 1 && colors[0].includes(",")) {
        return colors[0].split(",").map((c) => c.trim());
      }
      return colors;
    }
    return colors.split(",").map((c) => c.trim());
  };

  const sizes = normalizeSizes(singleProduct?.sizes);
  const colors = normalizeColors(singleProduct?.colors);

  return (
    <div className="flex max-w-7xl mx-5 my-4 flex-col gap-4 lg:flex-row">
      <div className="flex flex-col gap-5 w-full lg:w-1/2 lg:flex-row">
        <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-x-hidden flex-row">
          {loading ? (
            <FadeLoader />
          ) : (
            singleProduct?.images?.map((image, idx) => (
              <img
                className="w-28 h-28 rounded-md cursor-pointer object-cover"
                key={idx}
                src={image.url}
                alt="cloth"
                onClick={() => setMainImage(image.url)}
              />
            ))
          )}
        </div>
        <div className="flex-1 flex">
          {loading ? (
            <div className="flex items-center justify-center h-full w-full">
              <FadeLoader />
            </div>
          ) : (
            <img
              className="lg:h-[495px] w-full object-cover object-center rounded-md"
              src={mainImage}
              alt=""
            />
          )}
        </div>
      </div>

      <div className="grow flex w-full lg:w-1/2 flex-col gap-3 justify-between">
        {loading ? (
          <FadeLoader />
        ) : (
          <>
            <h1 className="uppercase font-medium">{singleProduct?.name}</h1>
            <div className="flex gap-5">
              <p className="font-semibold">
                <span>{import.meta.env.VITE_CURRENCY}</span>{" "}
                {singleProduct?.discountPrice}
              </p>
            </div>
            <div>
              <h1 className="font-medium">Description</h1>
              <div className="text-sm">{singleProduct?.description}</div>
            </div>

            <div>
              <h1 className="font-medium my-2">Colors</h1>
              <div className="flex">
                {colors.map((color, idx) => (
                  <div
                    onClick={() => setColor(color)}
                    key={idx}
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer mr-2 ${
                      selectedColor === color
                        ? "border-black border-2"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>

              <h1 className="font-medium my-2">Sizes</h1>
              <div className="flex gap-3">
                {sizes.map((size, idx) => (
                  <button
                    onClick={() => setSize(size)}
                    key={idx}
                    className={`w-12 h-12 flex items-center justify-center rounded-md ${
                      selectedSize === size
                        ? "bg-white text-black border-black border-2"
                        : "bg-black text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <h1 className="font-medium my-2">Category</h1>
              {singleProduct?.category && (
                <p className="text-sm">{singleProduct?.category}</p>
              )}
            </div>

            <div className="flex items-center gap-5 w-full">
              <button
                onClick={() => handleQuantity("minus")}
                className="bg-black text-white px-3 rounded-sm py-2"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => handleQuantity("plus")}
                className="bg-black text-white px-3 rounded-sm py-2"
              >
                +
              </button>
            </div>

            <button
              onClick={handleCartSubmit}
              className={`w-full bg-black text-white rounded-md py-3 hover:bg-black/90 transition-all duration-300 flex items-center justify-center gap-2 ${
                addcartLoading ? "cursor-not-allowed bg-black/90" : ""
              }`}
            >
              {addcartLoading ? (
                <>
                  <FadeLoader
                    className="translate-y-3"
                    color="#fff"
                    height={4}
                    width={1.5}
                    margin={-6}
                  />
                  <span className="text-sm">Adding in the Cart....</span>
                </>
              ) : (
                "Add to Cart"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
