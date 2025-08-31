import React, { useState } from "react";
import AdminHeader from "../../components/Admin/AdminHeader";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  GetSingleProduct,
  EditProductadmin,
} from "../../redux/slices/ProductSlice";
import FadeLoader from "react-spinners/FadeLoader";
import { toast } from "react-toastify";

const EditProduct = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    dispatch(GetSingleProduct(id));
  }, [dispatch, id]);

  const { singleProduct, singleLoading, editLoading } = useSelector(
    (state) => state.product
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      price: "",
      discountPrice: "",
      countInStock: "",
      category: "",
      brand: "",
      sizes: "",
      colors: "",
      collections: "",
      material: "",
      gender: "",
      numReviews: "",
    },
  });

  useEffect(() => {
    if (singleProduct) {
      reset({
        name: singleProduct.name || "",
        sku: singleProduct.sku || "",
        description: singleProduct.description || "",
        price: singleProduct.price || "",
        discountPrice: singleProduct.discountPrice || "",
        countInStock: singleProduct.countInStock || "",
        category: singleProduct.category || "",
        brand: singleProduct.brand || "",
        sizes: singleProduct.sizes?.join(", ") || "",
        colors: singleProduct.colors?.join(", ") || "",
        collections: singleProduct.collections || "",
        material: singleProduct.material || "",
        gender: singleProduct.gender || "",
        numReviews: singleProduct.numReviews || "",
      });

      setExistingImages(singleProduct.images || []);
    }
  }, [singleProduct, reset]);

  const [selectedImages, setSelectedImages] = useState([]);

  const onSubmit = (data) => {
    if (typeof data.sizes === "string" && !data.sizes.includes(",")) {
      return toast.error("Sizes must be comma seprated");
    }

    if (typeof data.colors === "string" && !data.colors.includes(",")) {
      return toast.error("colors must be comma seprated");
    }
    const formattedData = {
      ...singleProduct,
      ...data,
      sizes: data.sizes
        ? data.sizes
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s !== "")
        : [],
      colors: data.colors
        ? data.colors
            .split(",")
            .map((c) => c.trim())
            .filter((c) => c !== "")
        : [],
    };

    const formData = new FormData();
    Object.keys(formattedData).forEach((key) => {
      if (key !== "images") {
        formData.append(key, formattedData[key]);
      }
    });

    selectedImages.forEach((file) => formData.append("images", file));

    existingImages.forEach((img) =>
      formData.append("existingImages[]", img.url || img)
    );

    dispatch(EditProductadmin({ id, formData }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <AdminHeader title="Edit Product" />

      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        {singleLoading ? (
          <FadeLoader />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Name */}
            <div>
              <label className="block font-medium">Name</label>
              <input
                type="text"
                {...register("name", { required: "Product name is required" })}
                className="w-full border rounded-lg p-2"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* SKU */}
            <div>
              <label className="block font-medium">SKU</label>
              <input
                type="text"
                {...register("sku", { required: "SKU is required" })}
                className="w-full border rounded-lg p-2"
              />
              {errors.sku && (
                <p className="text-red-500 text-sm">{errors.sku.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block font-medium">Description</label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows="3"
                className="w-full border rounded-lg p-2"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block font-medium">Price ($)</label>
              <input
                type="number"
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  min: 0,
                })}
                className="w-full border rounded-lg p-2"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            {/* Discount Price */}
            <div>
              <label className="block font-medium">Discount Price ($)</label>
              <input
                type="number"
                step="0.01"
                {...register("discountPrice", { min: 0 })}
                className="w-full border rounded-lg p-2"
              />
            </div>

            {/* Stock Count */}
            <div>
              <label className="block font-medium">Stock Count</label>
              <input
                type="number"
                {...register("countInStock", {
                  required: "Stock count is required",
                  min: 0,
                })}
                className="w-full border rounded-lg p-2"
              />
              {errors.countInStock && (
                <p className="text-red-500 text-sm">
                  {errors.countInStock.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block font-medium">Category</label>
              <input
                type="text"
                {...register("category", { required: "Category is required" })}
                className="w-full border rounded-lg p-2"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block font-medium">Brand</label>
              <input
                type="text"
                {...register("brand", { required: "Brand is required" })}
                className="w-full border rounded-lg p-2"
              />
            </div>

            {/* Sizes */}
            <div>
              <label className="block font-medium">
                Sizes (comma separated)
              </label>
              <input
                type="text"
                {...register("sizes")}
                placeholder="e.g. S, M, L"
                className="w-full border rounded-lg p-2"
              />
            </div>

            {/* Colors */}
            <div>
              <label className="block font-medium">
                Colors (comma separated)
              </label>
              <input
                type="text"
                {...register("colors")}
                placeholder="e.g. Red, Blue, Black"
                className="w-full border rounded-lg p-2"
              />
            </div>

            {/* Collection */}
            <div>
              <label className="block font-medium">Collection</label>
              <input
                type="text"
                {...register("collections")}
                className="w-full border rounded-lg p-2"
              />
            </div>

            {/* Material */}
            <div>
              <label className="block font-medium">Material</label>
              <input
                type="text"
                {...register("material")}
                className="w-full border rounded-lg p-2"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block font-medium">Gender</label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Select Gender</option>
                <option value="Women">Women</option>
                <option value="Men">Men</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            {/* Number of Reviews */}
            <div>
              <label className="block font-medium">Number of Reviews</label>
              <input
                type="number"
                {...register("numReviews", { min: 0 })}
                className="w-full border rounded-lg p-2"
              />
            </div>

            {/* Multiple Image Upload */}
            <div className="md:col-span-2">
              <label className="block font-medium">Edit Product Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full border rounded-lg p-2"
              />

              {/* Existing images */}
              {existingImages.length > 0 && (
                <div>
                  <p className="mt-3 text-gray-600 text-sm">Existing Images:</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {existingImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={img.url || img}
                          alt={`existing-${idx}`}
                          className="w-24 h-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New images */}
              {selectedImages.length > 0 && (
                <div>
                  <p className="mt-3 text-gray-600 text-sm">Newly Added:</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {selectedImages.map((file, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`new-${idx}`}
                          className="w-24 h-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                disabled={editLoading}
                type="submit"
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg  ${
                  editLoading ? "bg-gray-300" : "hover:bg-blue-700"
                }`}
              >
                {editLoading ? (
                  <p>Updating Product...</p>
                ) : (
                  <p> Update Product</p>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProduct;
