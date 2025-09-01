import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import productReducer from "./slices/ProductSlice";
import cartReducer from "./slices/CartSlice";
import adminReducer from "./slices/AdminSlice";
import orderReducer from "./slices/OrderSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    admin: adminReducer,
    order: orderReducer,
  },
});
