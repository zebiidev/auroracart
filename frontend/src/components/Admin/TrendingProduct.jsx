import React from "react";

const TrendingProduct = ({ trending }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Trending Products
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Total Sold</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {trending.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md border"
                  />
                </td>
                <td className="px-4 py-2 font-medium text-gray-700">
                  {item.name}
                </td>
                <td className="px-4 py-2 text-gray-600">{item.totalOrdered}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrendingProduct;
