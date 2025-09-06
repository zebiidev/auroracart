import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

axios.defaults.baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const initialGuestId = localStorage.getItem("guestId") || uuidv4();
localStorage.setItem("guestId", initialGuestId);

const initialState = {
  user: null,
  loading: false,
  authLoading: true,
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
  guestId: initialGuestId,
};

export const login = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/user/login", data);

      if (!res.data.success) {
        toast.error(res.data.message);
        return rejectWithValue(res.data.message || "Login failed");
      }

      if (res.data.success) {
        toast.success(res.data.message);
        return { isUser: res.data.isUser, token: res.data.token };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/user/register", formData);
      if (!res.data.success) {
        toast.error(res.data.message);
        return rejectWithValue(res.data.message || "Regiter failed");
      }
      if (res.data.success) {
        toast.success(res.data.message);
        return {
          registeredUser: res.data.registeredUser,
          token: res.data.token,
        };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const AuthInfo = createAsyncThunk(
  "/authInfo",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      if (!token) {
        return rejectWithValue("No token found. Please login.");
      }

      const res = await axios.get("/api/user/auth-info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        return res.data.userInfo;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error(
          error.response.data.message || "Session expired. Please login again."
        );
        localStorage.removeItem("token");
        return rejectWithValue("Unauthorized");
      }

      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.isUser;
        state.token = action.payload.token;
        localStorage.setItem("token", JSON.stringify(action.payload.token));
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.registeredUser;
        state.token = action.payload.token;
        localStorage.setItem("token", JSON.stringify(action.payload.token));
      })
      .addCase(register.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(AuthInfo.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(AuthInfo.fulfilled, (state, action) => {
        state.authLoading = false;
        state.user = action.payload;
      })
      .addCase(AuthInfo.rejected, (state) => {
        state.authLoading = false;
        state.user = null;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
