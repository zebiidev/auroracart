import React, { useEffect } from "react";
import AdminHeader from "../../components/Admin/AdminHeader";
import ProductTable from "../../components/Admin/ProductTable";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AllProductsAdmin } from "../../redux/slices/AdminSlice";
const ProductManagement = () => {
  const { adminPrd } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminPrd || adminPrd.length === 0) {
      dispatch(AllProductsAdmin());
    }
  }, [dispatch, adminPrd]);

  return (
    <div>
      <div className="w-full items-center flex flex-col md:flex-row justify-between">
        <AdminHeader title="Product Management" />
        <div className="mx-9">
          <button
            onClick={() => navigate("/admin/add-product")}
            className="text-sm mb-6 md:mb-0 bg-green-500 text-white px-3 py-2 rounded-md font-medium"
          >
            Add New Product
          </button>
        </div>
      </div>
      <div className="md:mx-9 mx-5">
        <ProductTable />
      </div>
    </div>
  );
};

export default ProductManagement;
