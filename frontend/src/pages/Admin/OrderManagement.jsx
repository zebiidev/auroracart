import React from "react";
import AdminHeader from "../../components/Admin/AdminHeader";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";

const OrderManagement = () => {
  const orders = [
    {
      orderId: 123,
      customer: "John Doe",
      price: 100,
      status: "Processing",
    },
  ];

  const handleStatusChange = (orderId, newStatus) => {
    console.log(`Order ${orderId} status changed to:`, newStatus);
    // later you can update state or make API call here
  };

  return (
    <div className="max-w-7xl">
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
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                      #{order.orderId}
                    </td>
                    <td className="py-4 px-4">{order.customer}</td>
                    <td className="py-4 px-4">${order.price}</td>
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.orderId, e.target.value)
                        }
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Complete">Complete</option>
                      </select>
                    </td>
                    <td>
                      <button className="text-red-500 hover:text-red-700">
                        <RiDeleteBinLine size={18} />
                      </button>
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
  );
};

export default OrderManagement;
