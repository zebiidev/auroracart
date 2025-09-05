import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  orders: [],
  loading: false,
  delLoading: false,
  orderDetails: null,
  updateLoading: false,
  detailLoading: false,
  myOrders: null,
  myLoading: false,
};

export const GetAllOrders = createAsyncThunk(
  "/getallorders",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      if (!token) {
        return rejectWithValue("Token not available");
      }
      const res = await axios.get("/api/order/all-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        return res.data.allOrders;
      }
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const DeleteOrder = createAsyncThunk(
  "/delOrder",
  async (id, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      if (!token) {
        return rejectWithValue("Token not available");
      }
      const res = await axios.delete(`/api/order/del-order/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        return res.data.id;
      }
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const GetOrderDetails = createAsyncThunk(
  "/orderdetails",
  async (id, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      if (!token) {
        return rejectWithValue("Token not available");
      }
      const res = await axios.get(`/api/order/order-Details/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        return res.data.orderDetails;
      }
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const UpdateOrderStatus = createAsyncThunk(
  "/updateOrder",
  async ({ id, updatedStatus }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      if (!token) {
        return rejectWithValue("Token not available");
      }
      const res = await axios.put(
        `/api/order/update-order-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id,
            updatedStatus,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        return { id, updatedStatus };
      }
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const MyOrderss = createAsyncThunk(
  "/myorders",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      if (!token) {
        return rejectWithValue("Token not available");
      }
      const res = await axios.get("/api/order/get-my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        return res.data.myOrders;
      }
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(GetAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(GetAllOrders.rejected, (state) => {
        state.loading = false;
      })
      .addCase(DeleteOrder.pending, (state) => {
        state.delLoading = true;
      })
      .addCase(DeleteOrder.fulfilled, (state, action) => {
        state.delLoading = false;
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
      })
      .addCase(DeleteOrder.rejected, (state) => {
        state.delLoading = false;
      })
      .addCase(GetOrderDetails.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(GetOrderDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(GetOrderDetails.rejected, (state) => {
        state.detailLoading = false;
      })
      .addCase(UpdateOrderStatus.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(UpdateOrderStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.orders = state.orders.map((order) =>
          order._id === action.payload.id
            ? { ...order, status: action.payload.updatedStatus }
            : order
        );
      })
      .addCase(UpdateOrderStatus.rejected, (state) => {
        state.updateLoading = false;
      })
      .addCase(MyOrderss.pending, (state) => {
        state.myLoading = true;
      })
      .addCase(MyOrderss.fulfilled, (state, action) => {
        state.myLoading = false;
        state.myOrders = action.payload;
      })
      .addCase(MyOrderss.rejected, (state) => {
        state.myLoading = false;
      });
  },
});

export default orderSlice.reducer;
