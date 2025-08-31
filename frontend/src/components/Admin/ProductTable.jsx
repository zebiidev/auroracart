import React, { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FadeLoader from "react-spinners/FadeLoader";
import { DelProductadmin } from "../../redux/slices/ProductSlice";

const ProductTable = () => {
  const dispatch = useDispatch();
  const [del, setDel] = useState(null);
  const { products, loading, delLoading } = useSelector(
    (state) => state.product
  );

  const handleDelProduct = (id) => {
    setDel(id);
    dispatch(DelProductadmin(id));
  };

  const handleEdit = (id) => {
    console.log(id);
  };

  const navigate = useNavigate();
  return (
    <div className="w-full">
      <h1 className="text-sm py-2 text-gray-500">
        TotalProucts <span>{products.length}</span>
      </h1>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">image</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4}>
                  <FadeLoader />
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((products) => (
                <tr
                  key={products.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="w-11 h-11 object-cover object-center">
                    <img
                      className="rounded-md my-2 mx-2"
                      src={products.images[0].url}
                      alt="name"
                    />
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                    {products.name}
                  </td>
                  <td
                    className="py-4 px-4 font-medium text-gray-900 max-w-[200px] truncate"
                    title={products.price}
                  >
                    {products.price}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    {products.sku}
                  </td>
                  <td className="p-4 flex items-center mt-4 gap-6 text-xl">
                    <div>
                      {del === products._id && delLoading ? (
                        <FadeLoader />
                      ) : (
                        <RiDeleteBinLine
                          onClick={() => handleDelProduct(products._id)}
                          className="cursor-pointer hover:text-red-500"
                        />
                      )}
                    </div>
                    <div>
                      <FaEdit
                        onClick={() => {
                          navigate(`/admin/edit-product/${products._id}`);
                          handleEdit(products._id);
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
