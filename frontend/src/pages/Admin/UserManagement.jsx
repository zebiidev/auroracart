import React from "react";
import AdminHeader from "../../components/Admin/AdminHeader";
import { useForm } from "react-hook-form";
import UserTable from "../../components/Admin/UserTable";
import { useDispatch, useSelector } from "react-redux";
import { AddUser } from "../../redux/slices/AdminSlice";

const UserManagement = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.admin);

  const onSubmit = (data) => {
    dispatch(AddUser(data));
  };

  const firstName = watch("firstName");
  const password = watch("password");
  const email = watch("email");

  return (
    <div>
      <AdminHeader title="User Management" />

      <form
        className="bg-white   rounded-md mx-5 shadow-xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="md:p-5 px-5 text-xl tracking-normal font-semibold">
          Add New User
        </h1>
        <div className="relative mx-5">
          <input
            {...register("firstName", {
              required: true,
            })}
            className="peer my-4 py-2 px-2 border rounded-md outline-none w-full"
            type="text"
            placeholder=" "
            id="name"
          />
          {errors.name && (
            <p className="text-red-600 text-sm">Name is Required*</p>
          )}
          <label
            className={`absolute transition-all ease-out duration-200 left-2
    ${firstName ? "top-1 text-black text-sm bg-gray-50" : "top-6 text-gray-500"}
    peer-focus:top-1 peer-focus:text-black peer-focus:text-sm peer-focus:bg-gray-50
  `}
            htmlFor="name"
          >
            Enter Name
          </label>
        </div>
        <div className="relative mx-5">
          <input
            {...register("email", {
              required: true,
            })}
            className="peer my-4 rounded-md py-2 px-2 border outline-none w-full"
            type="email"
            placeholder=" "
            id="email"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">Email is Required*</p>
          )}
          <label
            className={`absolute transition-all ease-out duration-200 left-2
    ${email ? "top-1 text-black text-sm bg-gray-50" : "top-6 text-gray-500"}
    peer-focus:top-1 peer-focus:text-black peer-focus:text-sm peer-focus:bg-gray-50
  `}
            htmlFor="email"
          >
            Enter Email
          </label>
        </div>
        <div className="relative mx-5">
          <input
            {...register("password", {
              required: "Password is required*",
              minLength: {
                value: 8,
                message: "Password must contain at least 8 characters",
              },
            })}
            className="peer my-4 py-2 px-2 border rounded-md outline-none w-full"
            type="password"
            placeholder=" "
            id="password"
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password.message}</p>
          )}
          <label
            className={`absolute transition-all ease-out duration-200 left-2
    ${password ? "top-1 text-black text-sm bg-gray-50" : "top-6 text-gray-500"}
    peer-focus:top-1 peer-focus:text-black peer-focus:text-sm peer-focus:bg-gray-50
  `}
            htmlFor="password"
          >
            Enter Password
          </label>
        </div>

        <div className="mx-5">
          <select
            {...register("role")}
            className=" my-4 py-2 px-2 border rounded-md outline-none w-full"
            id="id"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          disabled={loading}
          className={`mx-5 px-3 py-2 bg-green-500 my-3 rounded-md font-medium text-white ${
            loading ? "bg-gray-300 cursor-not-allowed" : ""
          }`}
        >
          {loading ? <p>Adding User...</p> : <p>Add User</p>}
        </button>
      </form>
      <div className="mx-5 overflow-x-auto pt-11">
        <UserTable />
      </div>
    </div>
  );
};

export default UserManagement;
