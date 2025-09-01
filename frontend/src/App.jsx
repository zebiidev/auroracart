// App.jsx
import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ProductDetails from "./pages/ProductDetails";
import Collection from "./pages/Collection";
import Checkout from "./pages/Checkout";
import Footer from "./components/Footer";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import MyOrders from "./pages/MyOrders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CheckoutNavbar from "./components/CheckoutNavbar";
import Cart from "./pages/Cart";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminHomePage from "./pages/Admin/AdminHomePage";
import UserManagement from "./pages/Admin/UserManagement";
import ProductManagement from "./pages/Admin/ProductManagement";
import OrderManagement from "./pages/Admin/OrderManagement";
import AddProduct from "./pages/Admin/AddProduct";
import EditProduct from "./pages/Admin/EditProduct";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";
import { GetAllProducts } from "./redux/slices/ProductSlice";
import { useDispatch } from "react-redux";
import { GetUserCart } from "./redux/slices/CartSlice";
import { AuthInfo } from "./redux/slices/AuthSlice";
import PrivateRoutes from "./components/PrivateRoutes";
import { GetAllOrders } from "./redux/slices/OrderSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(AuthInfo()).then(() => {
      dispatch(GetUserCart());
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(GetAllProducts());
  }, []);

  useEffect(() => {
    dispatch(AuthInfo());
  }, []);

  useEffect(() => {
    dispatch(GetAllOrders());
  }, []);
  const location = useLocation();

  const isCheckoutPage = location.pathname.startsWith("/checkout");
  const isAdminPage = location.pathname.startsWith("/admin");
  const isSuccess = location.pathname.startsWith("/success");
  const isCancel = location.pathname.startsWith("/cancel");
  const isLogin = location.pathname.startsWith("/login");
  return (
    <div className="flex flex-col min-h-screen">
      {isAdminPage || isSuccess || isCancel ? null : isCheckoutPage ? (
        <CheckoutNavbar />
      ) : (
        <Navbar />
      )}

      <main
        className={`flex-grow ${
          isAdminPage || isSuccess || isCancel
            ? "pt-0"
            : isCheckoutPage
            ? "pt-0"
            : "pt-[70px] md:pt-[50px]"
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product-detail/:id" element={<ProductDetails />} />
          <Route path="/collection" element={<Collection />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />

          <Route element={<PrivateRoutes role="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminHomePage />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="edit-product/:id" element={<EditProduct />} />
            </Route>
          </Route>
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </main>

      {!isAdminPage && !isSuccess && !isCancel && !isCheckoutPage && <Footer />}
    </div>
  );
};

export default App;
