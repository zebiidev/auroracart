import React, { useEffect, useMemo } from "react";
import { IoClose } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { GetFilteredProducts } from "../redux/slices/ProductSlice";

const FiltersDrawer = ({ toggleFilterDrawer }) => {
  const { products } = useSelector((state) => state.product);
  const category = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );
  const brand = useMemo(
    () => [...new Set(products.map((p) => p.brand))],
    [products]
  );
  const material = useMemo(
    () => [...new Set(products.map((p) => p.material))],
    [products]
  );
  const collections = useMemo(
    () => [
      ...new Set(
        products.flatMap((p) =>
          Array.isArray(p.collections) ? p.collections : [p.collections]
        )
      ),
    ],
    [products]
  );
  const gender = useMemo(
    () => [...new Set(products.map((p) => p.gender))],
    [products]
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const { register, watch, setValue, reset } = useForm({
    defaultValues: {
      category: params.category?.split(",") || [],
      gender: params.gender || "",
      brand: params.brand?.split(",") || [],
      collections: params.collections?.split(",") || [],
      material: params.material?.split(",") || [],
      minPrice: params.minPrice ? parseFloat(params.minPrice) : "",
      maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : "",
    },
  });

  const values = watch();
  const dispatch = useDispatch();

  useEffect(() => {
    const query = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        const filtered = value.filter(Boolean);
        if (filtered.length > 0) query.set(key, filtered.join(","));
        else query.delete(key);
      } else {
        if (
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ""
        ) {
          query.set(key, value);
        } else {
          query.delete(key);
        }
      }
    });
    setSearchParams(query);
  }, [values, setSearchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const paramsObj = Object.fromEntries(searchParams.entries());
      const filters = {
        category: paramsObj.category
          ? paramsObj.category.split(",").filter(Boolean)
          : [],
        brand: paramsObj.brand
          ? paramsObj.brand.split(",").filter(Boolean)
          : [],
        collections: paramsObj.collections
          ? paramsObj.collections.split(",").filter(Boolean)
          : [],
        material: paramsObj.material
          ? paramsObj.material.split(",").filter(Boolean)
          : [],
        gender:
          paramsObj.gender && paramsObj.gender.trim() !== ""
            ? paramsObj.gender
            : null,
        minPrice:
          paramsObj.minPrice && !isNaN(paramsObj.minPrice)
            ? Number(paramsObj.minPrice)
            : null,
        maxPrice:
          paramsObj.maxPrice && !isNaN(paramsObj.maxPrice)
            ? Number(paramsObj.maxPrice)
            : null,
      };
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) =>
          Array.isArray(v) ? v.length > 0 : v !== null && v !== ""
        )
      );
      dispatch(GetFilteredProducts(cleanFilters));
    }, 300);
    return () => clearTimeout(handler);
  }, [searchParams, dispatch]);

  return (
    <form className="relative overflow-y-auto p-3 space-y-5">
      <h1 className="md:hidden block pt-10 font-medium text-lg">Filters</h1>
      <div
        onClick={toggleFilterDrawer}
        className="absolute md:hidden block right-3 top-3 text-2xl cursor-pointer"
      >
        <IoClose />
      </div>

      <div>
        <h1 className="text-lg font-medium mb-2">Category</h1>
        {category.map((c, index) => (
          <label key={`${c}-${index}`} className="flex items-center gap-2">
            <input type="checkbox" value={c} {...register("category")} />
            <span>{c}</span>
          </label>
        ))}
      </div>

      <div>
        <h1 className="text-lg font-medium mb-2">Gender</h1>
        {gender.map((g, index) => (
          <label key={`${g}-${index}`} className="flex items-center gap-2">
            <input
              type="radio"
              value={g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()}
              {...register("gender")}
            />
            <span>{g}</span>
          </label>
        ))}
      </div>

      <div>
        <h1 className="text-lg font-medium mb-2">Brand</h1>
        {brand.map((b, index) => (
          <label key={`${b}-${index}`} className="flex items-center gap-2">
            <input type="checkbox" value={b} {...register("brand")} />
            <span>{b}</span>
          </label>
        ))}
      </div>

      <div>
        <h1 className="text-lg font-medium mb-2">Collections</h1>
        {collections.map((col, index) => (
          <label key={`${col}-${index}`} className="flex items-center gap-2">
            <input type="checkbox" value={col} {...register("collections")} />
            <span>{col}</span>
          </label>
        ))}
      </div>

      <div>
        <h1 className="text-lg font-medium mb-2">Materials</h1>
        {material.map((m, index) => (
          <label key={`${m}-${index}`} className="flex items-center gap-2">
            <input type="checkbox" value={m} {...register("material")} />
            <span>{m}</span>
          </label>
        ))}
      </div>

      <div>
        <h1 className="text-lg font-medium mb-2">Price (Max)</h1>
        <input
          type="range"
          min="0"
          max="500"
          step="1"
          value={values.maxPrice ?? 500}
          onChange={(e) => setValue("maxPrice", parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>{values.maxPrice ? `$${values.maxPrice}` : "∞"}</span>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={() => reset()}
          className="px-3 py-1 bg-gray-200 rounded-md text-sm"
        >
          Clear Filters
        </button>
      </div>
    </form>
  );
};

export default React.memo(FiltersDrawer);
