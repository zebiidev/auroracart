import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  products: [],
  singleProduct: null,
  loading: false,
  productsSearched: [],
  count: 0,
  filtered: [],
  addloading: false,
  delLoading: false,
  editLoading: false,
  singleLoading: false,
  total: null,
  page: null,
  pages: null,
};
export const GetAllProducts = createAsyncThunk(
  "products/getAll",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `/api/product/all-products?page=${page}&limit=${limit}`
      );

      if (res.data.success) {
        return {
          products: res.data.products, // paginated products
          total: res.data.total, // total count
          page: res.data.page, // current page
          pages: res.data.pages, // total pages
        };
      } else {
        return rejectWithValue("Failed to fetch products");
      }
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const GetSingleProduct = createAsyncThunk(
  "/singleproduct",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/product/single-product/${id}`);

      if (res.data.success) {
        return res.data.singleProduct;
      }
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const SearchedProducts = createAsyncThunk(
  "/searchedProducts",
  async (searched, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/product/searched-product", {
        params: {
          name: searched,
          material: searched,
          category: searched,
          brand: searched,
        },
      });

      if (res.data.success) {
        return {
          searchedProduct: res.data.searchedProduct,
          count: res.data.count,
        };
      }
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const GetFilteredProducts = createAsyncThunk(
  "products/getFilteredProducts",
  async (filters, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/product/filtered-products", {
        params: filters,
      });

      if (res.data.success) {
        return {
          filteredProducts: res.data.products,
          count: res.data.products.length,
        };
      } else {
        return rejectWithValue(res.data.message);
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

export const AddProductadmin = createAsyncThunk(
  "/add-product",
  async (formData, { rejectWithValue, getState }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await axios.post("/api/admin/add-product", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        return res.data.newProduct;
      }
    } catch (error) {
      console.log(error);
      const msg = error.response?.data.message;
      toast.error(msg);
      return rejectWithValue(error.data);
    }
  }
);
export const DelProductadmin = createAsyncThunk(
  "/del-product",
  async (id, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await axios.delete(`/api/admin/del-product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        return res.data.id;
      }
    } catch (error) {
      console.log(error);
      const msg = error.response?.data.message;
      toast.error(msg);
      return rejectWithValue(error.data);
    }
  }
);
export const EditProductadmin = createAsyncThunk(
  "/edit-product",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const res = await axios.put(`/api/admin/edit-product/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        return { product: res.data.product, id: id };
      }
    } catch (error) {
      console.log(error);
      const msg = error.response?.data.message;
      toast.error(msg);
      return rejectWithValue(error.data);
    }
  }
);

const productSlice = createSlice({
  name: "Products",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(GetAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetAllProducts.fulfilled, (state, action) => {
        if (action.payload.page === 1) {
          state.products = action.payload.products;
        } else {
          state.products = [...state.products, ...action.payload.products];
        }
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(GetAllProducts.rejected, (state) => {
        state.loading = false;
        state.products = [];
      })
      .addCase(GetSingleProduct.pending, (state) => {
        state.singleLoading = true;
      })
      .addCase(GetSingleProduct.fulfilled, (state, action) => {
        state.singleLoading = false;
        state.singleProduct = action.payload;
      })
      .addCase(GetSingleProduct.rejected, (state) => {
        state.singleLoading = false;
        state.singleProduct = null;
      })
      .addCase(SearchedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(SearchedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productsSearched = action.payload.searchedProduct;
        state.count = action.payload.count;
      })
      .addCase(SearchedProducts.rejected, (state) => {
        state.loading = false;
        state.productsSearched = null;
        state.count = 0;
      })
      .addCase(GetFilteredProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetFilteredProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.filtered = action.payload.filteredProducts;
        state.count = action.payload.count;

        if (
          state.products.length === 0 &&
          action.payload.filteredProducts.length > 0
        ) {
          state.products = action.payload.filteredProducts;
        }
      })
      .addCase(GetFilteredProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(AddProductadmin.pending, (state) => {
        state.addloading = true;
      })
      .addCase(AddProductadmin.fulfilled, (state, action) => {
        state.addloading = false;
        if (action.payload) {
          state.products.push(action.payload);
        }
      })
      .addCase(AddProductadmin.rejected, (state, action) => {
        state.addloading = false;
        state.error = action.payload;
      })
      .addCase(DelProductadmin.pending, (state) => {
        state.delLoading = true;
      })
      .addCase(DelProductadmin.fulfilled, (state, action) => {
        state.delLoading = false;
        if (action.payload) {
          state.products = state.products.filter(
            (item) => item._id !== action.payload
          );
        }
      })
      .addCase(DelProductadmin.rejected, (state, action) => {
        state.delLoading = false;
        state.error = action.payload;
      })
      .addCase(EditProductadmin.pending, (state) => {
        state.editLoading = true;
      })
      .addCase(EditProductadmin.fulfilled, (state, action) => {
        state.editLoading = false;
        if (action.payload.id && action.payload.product) {
          state.products = state.products.map((item) =>
            item._id === action.payload.id
              ? { ...item, ...action.payload.product }
              : item
          );
        }
      })
      .addCase(EditProductadmin.rejected, (state, action) => {
        state.editLoading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
