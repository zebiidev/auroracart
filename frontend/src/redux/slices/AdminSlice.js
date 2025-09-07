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
        return res.data.totalRevenue;
      }
    } catch (error) {
      console.log(error);
      rejectWithValue(error.data);
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
        state.revenue = action.payload;
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
      });
  },
});

export default AdminSlice.reducer;
