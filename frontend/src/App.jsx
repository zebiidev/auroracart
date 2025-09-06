// App.jsx
import React, { useEffect, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CheckoutNavbar from "./components/CheckoutNavbar";
import PrivateRoutes from "./components/PrivateRoutes";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { AuthInfo } from "./redux/slices/AuthSlice";
import { GetUserCart } from "./redux/slices/CartSlice";
import "react-toastify/dist/ReactToastify.css";
import FadeLoader from "react-spinners/FadeLoader";

// ✅ Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Collection = lazy(() => import("./pages/Collection"));
const Checkout = lazy(() => import("./pages/Checkout"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Cart = lazy(() => import("./pages/Cart"));
const SuccessPage = lazy(() => import("./pages/SuccessPage"));
const CancelPage = lazy(() => import("./pages/CancelPage"));

// ✅ Lazy-loaded Admin section
const AdminLayout = lazy(() => import("./pages/Admin/AdminLayout"));
const AdminHomePage = lazy(() => import("./pages/Admin/AdminHomePage"));
const UserManagement = lazy(() => import("./pages/Admin/UserManagement"));
const ProductManagement = lazy(() => import("./pages/Admin/ProductManagement"));
const OrderManagement = lazy(() => import("./pages/Admin/OrderManagement"));
const AddProduct = lazy(() => import("./pages/Admin/AddProduct"));
const EditProduct = lazy(() => import("./pages/Admin/EditProduct"));

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(AuthInfo()).then(() => {
      dispatch(GetUserCart());
    });
  }, [dispatch]);

  const isCheckoutPage = location.pathname.startsWith("/checkout");
  const isAdminPage = location.pathname.startsWith("/admin");
  const isSuccess = location.pathname.startsWith("/success");
  const isCancel = location.pathname.startsWith("/cancel");

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
            : "pt-[170px] md:pt-[100px]"
        }`}
      >
        {/* ✅ Suspense wrapper for lazy-loaded routes */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-10">
              <FadeLoader />
            </div>
          }
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
        </Suspense>

        <ToastContainer position="top-right" autoClose={3000} />
      </main>

      {!isAdminPage && !isSuccess && !isCancel && !isCheckoutPage && <Footer />}
    </div>
  );
};

export default App;
