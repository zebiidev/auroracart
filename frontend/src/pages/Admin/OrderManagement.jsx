import React, { useState } from "react";
import AdminHeader from "../../components/Admin/AdminHeader";
import { RiDeleteBinLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import FadeLoader from "react-spinners/FadeLoader";
import { Eye } from "lucide-react";
import {
  DeleteOrder,
  GetOrderDetails,
  UpdateOrderStatus,
} from "../../redux/slices/OrderSlice";
import OrderDetailPopUp from "../../components/Admin/OrderDetailPopUp";

const OrderManagement = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [updating, setUpdating] = useState([]);
  const [delid, setDelId] = useState([]);

  const {
    orders,
    loading,
    detailLoading,
    orderDetails,
    updateLoading,
    delLoading,
  } = useSelector((state) => state.order);

  const dispatch = useDispatch();

  const handleStatusChange = (id, updatedStatus) => {
    setUpdating((prev) => [...prev, id]);
    dispatch(UpdateOrderStatus({ id, updatedStatus })).finally(() => {
      setUpdating((prev) => prev.filter((oid) => oid !== id));
    });
  };

  const handleDelete = (id) => {
    setDelId((prev) => [...prev, id]);
    dispatch(DeleteOrder(id)).finally(() => {
      setDelId((prev) => prev.filter((oid) => oid !== id));
    });
  };

  const handleOrderDetail = (id) => {
    setShowPopup(true);
    dispatch(GetOrderDetails(id));
  };

  return (
    <>
      {showPopup && (
        <OrderDetailPopUp
          orderDetails={orderDetails}
          setShowPopup={setShowPopup}
          detailLoading={detailLoading}
        />
      )}
      <div className={`max-w-7xl ${showPopup ? "backdrop-blur-lg" : ""}`}>
        <AdminHeader title="Order Management" />
        <div className="w-full">
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                <tr>
                  <th className="py-3 px-4">Order Id</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Total price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="items-center" colSpan={5}>
                      <div className="flex items-center justify-center py-6">
                        <FadeLoader />
                      </div>
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                        #{order._id}
                      </td>
                      <td className="py-4 px-4">{order.user?.firstName}</td>
                      <td className="py-4 px-4">
                        <span className="text-xs px-1">PKR</span>
                        {order.totalPrice}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {updateLoading && updating.includes(order._id) ? (
                            <FadeLoader height={10} width={3} />
                          ) : (
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order._id, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 flex items-center space-x-3">
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="text-red-500 hover:text-red-700"
                          disabled={delLoading}
                        >
                          {delLoading && delid.includes(order._id) ? (
                            <FadeLoader height={10} width={3} />
                          ) : (
                            <RiDeleteBinLine size={18} />
                          )}
                        </button>
                        <Eye
                          onClick={() => handleOrderDetail(order._id)}
                          className="w-5 h-5 text-blue-600 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 px-4 text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderManagement;
