import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  allusers: [],
  loading: false,
  delloading: false,
  getloading: false,
  searchloading: false,
  filteredUser: [],
  revenue: null,
  adminPrd: [],
  adminLoading: false,
  allTime: null,
  today: null,
  salesChart: [],
  orderChart: [],
  trending: [],
  monthly: null,
  orderThisMonth: null,
  stockTotal: null,
  userMonthly: [],
};
export const AddUser = createAsyncThunk(
  "/adduser",
  async (data, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await axios.post("/api/admin/add-user", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.data.success) {
        toast.error(res.data.message || "Failed to add user");
        return rejectWithValue(res.data.message);
      }

      toast.success(res.data.message);
      return res.data.newUser;
    } catch (error) {
      console.error("AddUser error:", error);

      const errMsg =
        error.response?.data?.message || "Something went wrong on AddUser";

      toast.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);

export const GetAllUsers = createAsyncThunk(
  "/getuser",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await axios.get("/api/admin/get-all-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        return res.data.user;
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.data);
    }
  }
);
export const DeleteUser = createAsyncThunk(
  "/deluser",
  async (id, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await axios.delete(`/api/admin/del-user/${id}`, {
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
      const msg = error?.response?.data?.message;
      toast.error(msg);
      return rejectWithValue(error.data);
    }
  }
);

export const SearchedUser = createAsyncThunk(
  "/searchuser",
  async ({ firstName, email }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await axios.get("/api/admin/searched-user", {
        params: {
          firstName,
          email,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        return res.data.filteredUser;
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.data);
    }
  }
);

export const AllProductsAdmin = createAsyncThunk(
  "/allproducts",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await axios.get("/api/admin/get-all-prd-admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        return res.data.adminPrd;
      }
    } catch (error) {
      console.log(error);
      rejectWithValue(error.data);
    }
  }
);
export const Revenue = createAsyncThunk(
  "/get-revenue",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await axios.get("/api/admin/get-revenue", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        return {
          today: res.data.revenueToday,
          monthly: res.data.revenueMonthly,
          allTime: res.data.total,
        };
      }
    } catch (error) {
      console.log(error);
      rejectWithValue(error.data);
    }
  }
);

export const GetMonthlySales = createAsyncThunk(
  "admin/monthly-sales",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await axios.get("/api/admin/monthly-sales", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        return res.data.sales;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const GetTrendingProducts = createAsyncThunk(
  "admin/trending-products",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await axios.get("/api/admin/trending-products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        return res.data.trendingProducts;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const GetOrdersByStatus = createAsyncThunk(
  "admin/orders-status",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await axios.get("/api/admin/orders-chart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        return res.data.orderstatuses;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const TotalOrdersThisMonth = createAsyncThunk(
  "admin/orders-thisMonth",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await axios.get("/api/admin/orders-thisMonth", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        return res.data.totalOrders;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const MonthlyUser = createAsyncThunk(
  "admin/users-monthly",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await axios.get("/api/admin/get-monthlyUser", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        return res.data.monthlyUser;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const LowStock = createAsyncThunk(
  "admin/low-stock",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await axios.get("/api/admin/low-stock", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        return res.data.total;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const AdminSlice = createSlice({
  name: "admin slice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(AddUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(AddUser.fulfilled, (state, action) => {
        if (action.payload && action.payload._id) {
          state.allusers.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(AddUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(GetAllUsers.pending, (state) => {
        state.getloading = true;
      })
      .addCase(GetAllUsers.fulfilled, (state, action) => {
        state.allusers = Array.isArray(action.payload) ? action.payload : [];
        state.getloading = false;
      })

      .addCase(GetAllUsers.rejected, (state) => {
        state.getloading = false;
      })
      .addCase(DeleteUser.pending, (state) => {
        state.delloading = true;
      })
      .addCase(DeleteUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.allusers = state.allusers.filter(
            (item) => item._id !== action.payload
          );
        }
        state.delloading = false;
      })

      .addCase(DeleteUser.rejected, (state) => {
        state.searchloading = false;
      })
      .addCase(SearchedUser.pending, (state) => {
        state.searchloading = true;
      })
      .addCase(SearchedUser.fulfilled, (state, action) => {
        state.filteredUser = action.payload;
        state.searchloading = false;
      })
      .addCase(SearchedUser.rejected, (state) => {
        state.searchloading = false;
      })
      .addCase(Revenue.pending, (state) => {})
      .addCase(Revenue.fulfilled, (state, action) => {
        state.revenue = action.payload.monthly;
        state.allTime = action.payload.allTime;
        state.today = action.payload.today;
        state.monthly = action.payload.monthly;
      })
      .addCase(Revenue.rejected, (state) => {
        state.revenue = null;
      })

      .addCase(AllProductsAdmin.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(AllProductsAdmin.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminPrd = action.payload;
      })
      .addCase(AllProductsAdmin.rejected, (state) => {
        state.adminPrd = [];
        state.adminLoading = false;
      })
      .addCase(GetMonthlySales.fulfilled, (state, action) => {
        state.salesChart = action.payload;
      })
      .addCase(GetMonthlySales.rejected, (state) => {
        state.salesChart = [];
      })
      .addCase(GetOrdersByStatus.fulfilled, (state, action) => {
        state.orderChart = action.payload;
      })
      .addCase(GetOrdersByStatus.rejected, (state, action) => {
        state.orderChart = [];
      })
      .addCase(GetTrendingProducts.fulfilled, (state, action) => {
        state.trending = action.payload;
      })
      .addCase(GetTrendingProducts.rejected, (state) => {
        state.trending = [];
      })
      .addCase(TotalOrdersThisMonth.fulfilled, (state, action) => {
        state.orderThisMonth = action.payload;
      })
      .addCase(TotalOrdersThisMonth.rejected, (state) => {
        state.orderThisMonth = null;
      })
      .addCase(LowStock.fulfilled, (state, action) => {
        state.stockTotal = action.payload;
      })
      .addCase(LowStock.rejected, (state) => {
        state.stockTotal = null;
      })
      .addCase(MonthlyUser.fulfilled, (state, action) => {
        state.userMonthly = action.payload;
      })
      .addCase(MonthlyUser.rejected, (state) => {
        state.userMonthly = [];
      });
  },
});

export default AdminSlice.reducer;
