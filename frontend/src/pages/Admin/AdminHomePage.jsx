import React, { useEffect } from "react";
import AdminHeader from "../../components/Admin/AdminHeader";
import { useDispatch, useSelector } from "react-redux";
import { GetAllUsers } from "../../redux/slices/AdminSlice";
import { Link } from "react-router-dom";

const AdminHomePage = () => {
  const { allusers } = useSelector((state) => state.admin);
  const { products } = useSelector((state) => state.product);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetAllUsers());
  }, [dispatch]);

  return (
    <div>
      <AdminHeader title="Store Stats" />
      <div className="grid mx-11 grid-cols-1 lg:grid-cols-3 gap-7 md:grid-cols-2">
        <div className="rounded-md bg-white shadow-xl">
          <div className="p-4">
            <h1 className="font-semibold text-lg">Revenue</h1>
            <div className="text-lg font-semibold">$1000</div>
          </div>
        </div>

        <div className="rounded-md bg-white shadow-xl">
          <div className="p-4">
            <h1 className="font-semibold text-lg">Total Orders</h1>
            <div className="text-lg font-semibold">
              {orders ? orders.length : 0}
            </div>
            <Link
              to="orders"
              className="inline-block py-2 font-medium text-blue-600 hover:underline"
            >
              Manage Orders
            </Link>
          </div>
        </div>

        <div className="rounded-md bg-white shadow-xl">
          <div className="p-4">
            <h1 className="font-semibold text-lg">Total Products</h1>
            <div className="text-lg font-semibold">
              {products.length && products.length}
            </div>
            <Link
              to="products"
              className="inline-block py-2 font-medium text-blue-600 hover:underline"
            >
              Manage Products
            </Link>
          </div>
        </div>

        <div className="rounded-md bg-white shadow-xl">
          <div className="p-4">
            <h1 className="font-semibold text-lg">Total Users</h1>
            <div className="text-lg font-semibold">
              {allusers.length && allusers.length}
            </div>
            <Link
              to="users"
              className="inline-block py-2 font-medium text-blue-600 hover:underline"
            >
              Manage Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
