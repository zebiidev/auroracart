import React, { useEffect } from "react";
import AdminHeader from "../../components/Admin/AdminHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  AllProductsAdmin,
  GetAllUsers,
  GetMonthlySales,
  GetOrdersByStatus,
  GetTrendingProducts,
  LowStock,
  MonthlyUser,
  Revenue,
  TotalOrdersThisMonth,
} from "../../redux/slices/AdminSlice";
import { Link } from "react-router-dom";
import MonthlySalesChart from "../../components/Admin/MonthlySalesChart";
import OrdersStatusChart from "../../components/Admin/OrdersStatusChart";
import TrendingProduct from "../../components/Admin/TrendingProduct";
import MonthlySummary from "../../components/Admin/MonthlySummary";

const AdminHomePage = () => {
  const { allusers } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Revenue());
    dispatch(LowStock());
    dispatch(GetOrdersByStatus());
    dispatch(GetTrendingProducts());
    dispatch(GetAllUsers()).then(() => dispatch(AllProductsAdmin()));
    dispatch(GetMonthlySales());
    dispatch(TotalOrdersThisMonth());
    dispatch(MonthlyUser());
  }, [dispatch]);
  const data = useSelector((state) => state.admin.salesChart);

  const orderData = useSelector((state) => state.admin.orderChart);

  const {
    revenue,
    allTime,
    today,
    trending,
    monthly,
    orderThisMonth,
    stockTotal,
    userMonthly,
  } = useSelector((state) => state.admin);

  return (
    <div>
      <AdminHeader title="Store Stats" />
      <div className="grid md:mx-11 grid-cols-1 lg:grid-cols-3 gap-7 md:grid-cols-2">
        <div className="rounded-md bg-white shadow-xl">
          <div className="p-4">
            <h1 className="font-semibold text-gray-500 text-md">
              Today's Revenue
            </h1>
            <div className="text-lg font-semibold">
              ${revenue ? today : "0"}
            </div>
          </div>
        </div>

        <div className="rounded-md bg-white shadow-xl">
          <div className="p-4">
            <h1 className="font-semibold text-gray-500 text-md">Total Users</h1>
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

        <div className="rounded-md bg-white shadow-xl">
          <div className="p-4">
            <h1 className="font-semibold text-gray-500 text-md">
              All Time Revenue
            </h1>
            <div className="text-lg font-semibold">
              ${allTime ? allTime : "0.00"}
            </div>
          </div>
        </div>
      </div>
      <div className="md:mx-11 grid grid-cols-1 gap-4 my-11 md:grid-cols-2">
        <MonthlySalesChart data={data} />
        <OrdersStatusChart data={orderData} />
      </div>
      <div className="grid md:mx-11 grid-cols-1 gap-7 md:grid-cols-2">
        <div>
          <TrendingProduct trending={trending} />
        </div>
        <div>
          <MonthlySummary
            monthly={monthly}
            monthlyOrder={orderThisMonth}
            trending={trending}
            stock={stockTotal}
            userMonthly={userMonthly}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
