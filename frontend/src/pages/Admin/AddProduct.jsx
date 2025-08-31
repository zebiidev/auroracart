import React, { useState } from "react";
import AdminHeader from "../../components/Admin/AdminHeader";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AddProductadmin } from "../../redux/slices/ProductSlice";
import { toast } from "react-toastify";

const AddProduct = () => {
  const disptch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { addloading } = useSelector((state) => state.product);

  const [selectedImages, setSelectedImages] = useState([]);

  const onSubmit = (data) => {
    if (typeof data.sizes === "string" && !data.sizes.includes(",")) {
      return toast.error("Sizes must be comma seprated");
    }

    if (typeof data.colors === "string" && !data.colors.includes(",")) {
      return toast.error("colors must be comma seprated");
    }
    const formattedData = {
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
      images: selectedImages,
    };

    const formData = new FormData();
    Object.keys(formattedData).forEach((key) => {
      if (key === "images") {
        formattedData.images.forEach((file) => formData.append("images", file));
      } else {
        formData.append(key, formattedData[key]);
      }
    });

    disptch(AddProductadmin(formData));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

  return (
    <div>
      <AdminHeader title="Add New Product" />

      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Product Name */}
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
              className="w-full border rounded-lg p-2"
              rows="3"
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
              {...register("price", { required: "Price is required", min: 0 })}
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
            <label className="block font-medium">Sizes (comma separated)</label>
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

          {/* Multiple Image Upload */}
          <div className="md:col-span-2">
            <label className="block font-medium">Product Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange} // 👈 only custom handler
              className="w-full border rounded-lg p-2"
            />
            {selectedImages.length === 0 && (
              <p className="text-red-500 text-sm">
                At least one image is required
              </p>
            )}

            {/* 👇 Previews */}
            <div className="flex flex-wrap gap-3 mt-3">
              {selectedImages.map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt={`preview-${idx}`}
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
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

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              disabled={addloading}
              type="submit"
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg  ${
                addloading ? "bg-gray-300" : "hover:bg-blue-700"
              }`}
            >
              {addloading ? <p>Adding Product..</p> : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
