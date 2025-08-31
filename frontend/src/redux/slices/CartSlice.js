import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  cart: [],
  cartLoading: false,
  userCart: null,
  addcartLoading: false,
};

export const AddtoCart = createAsyncThunk(
  "/addtocart",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/cart/add-to-cart", data);
      if (res.data.success) {
        toast.success(res.data.message);
        return res.data.cart;
      }
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.data);
    }
  }
);

export const GetUserCart = createAsyncThunk(
  "/getusercart",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { user, guestId } = getState().auth;

      const userId = user?._id || null;

      const res = await axios.get("/api/cart/get-user-cart", {
        params: {
          guestId,
          userId,
        },
      });

      if (res.data.success) {
        return res.data.userCart;
      }
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.data);
    }
  }
);

export const DelteItemFromCart = createAsyncThunk(
  "/delitem",
  async (data, { rejectWithValue }) => {
    try {
      console.log("sending data", data);
      const res = await axios.post("/api/cart/del-item-cart", data);

      console.log(res.data.message);

      if (res.data.success) {
        toast.success(res.data.message);
        return { id: res.data.productId };
      }
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.data);
    }
  }
);

export const IncreseCartQuantity = createAsyncThunk(
  "/incresequantity",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/cart/increase-quantity", data);

      if (res.data.success) {
        return res.data.cart;
      }
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.data);
    }
  }
);

export const DecreaseCartQuantity = createAsyncThunk(
  "/decreasequantity",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/cart/decrease-quantity", data);

      if (res.data.success) {
        return res.data.cart;
      }
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.data);
    }
  }
);

export const MergeCart = createAsyncThunk(
  "/mergecart",
  async (payload, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await axios.post("/api/cart/merge-cart", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        return res.data.cart;
      }
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.data);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(AddtoCart.pending, (state) => {
        state.addcartLoading = true;
      })
      .addCase(AddtoCart.fulfilled, (state, action) => {
        state.addcartLoading = false;
        state.userCart = action.payload;
      })
      .addCase(AddtoCart.rejected, (state) => {
        state.addcartLoading = false;
      })
      .addCase(GetUserCart.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(GetUserCart.fulfilled, (state, action) => {
        state.cartLoading = false;
        state.userCart = action.payload;
      })
      .addCase(GetUserCart.rejected, (state) => {
        state.cartLoading = false;
      })
      .addCase(DelteItemFromCart.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(DelteItemFromCart.fulfilled, (state, action) => {
        state.cartLoading = false;

        if (state.userCart && state.userCart.products) {
          state.userCart.products = state.userCart.products.filter(
            (item) => item.productId !== action.payload.id
          );
        }
      })

      .addCase(DelteItemFromCart.rejected, (state) => {
        state.cartLoading = false;
      })
      .addCase(IncreseCartQuantity.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(IncreseCartQuantity.fulfilled, (state, action) => {
        state.cartLoading = false;
        state.userCart = action.payload;
      })
      .addCase(IncreseCartQuantity.rejected, (state) => {
        state.cartLoading = false;
      })
      .addCase(DecreaseCartQuantity.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(DecreaseCartQuantity.fulfilled, (state, action) => {
        state.cartLoading = false;
        state.userCart = action.payload;
      })
      .addCase(DecreaseCartQuantity.rejected, (state) => {
        state.cartLoading = false;
      })
      .addCase(MergeCart.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(MergeCart.fulfilled, (state, action) => {
        state.cartLoading = false;
        state.userCart = action.payload;
      })
      .addCase(MergeCart.rejected, (state) => {
        state.cartLoading = false;
      });
  },
});

export default cartSlice.reducer;
