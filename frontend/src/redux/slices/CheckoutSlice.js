import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  checkoutLoading: false,
  userCheckout: null,
};

export const CreateCheckout = createAsyncThunk(
  "/createcheckout",
  async ({ formData, products, totalPrice }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const payload = {
        checkoutProducts: products,
        paymentMethod: formData.payment,
        shippingAddress: formData.shippingAddress,
        phoneNo: formData.phoneNo,
        firstName: formData.firstName,
        lastName: formData.lastName,
        shippingMethod: formData.shipping,
        totalPrice,
      };

      const res = await axios.post("/api/checkout/create-checkout", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        return res.data.checkout;
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const CheckoutSlice = createSlice({
  name: "checkout",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(CreateCheckout.pending, (state) => {
        state.checkoutLoading = true;
      })
      .addCase(CreateCheckout.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.userCheckout = action.payload;
      })
      .addCase(CreateCheckout.rejected, (state) => {
        state.checkoutLoading = false;
      });
  },
});

export default CheckoutSlice.reducer;
