import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { register } from "../redux/slices/AuthSlice";
import FadeLoader from "react-spinners/FadeLoader";
import { MergeCart } from "../redux/slices/CartSlice";

const Register = () => {
  const { loading, guestId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (e) => {
    const value = e.target.value;
    const { name } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName
    ) {
      return toast.error("Please fill all the fields");
    }

    if (formData.password.length < 8) {
      toast.error("Paswword contains at least 8 characters");
    }

    dispatch(register(formData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(MergeCart({ guestId }));
      }
    });
  };
  return (
    <div className="w-full h-[100vh] flex justify-center  mt-16">
      <div className="flex w-full flex-col items-center">
        <h1 className="text-4xl font-bold">Create Account</h1>
        <form
          onSubmit={handleSubmit}
          className="lg:w-1/3 md:w-1/2 w-full flex flex-col gap-7 px-4 md:px-0 mt-9"
        >
          <div className="relative">
            <input
              name="firstName"
              value={formData.firstName}
              id="firstName"
              onChange={handleChange}
              className="border-b peer placeholder:text-xs border-black px-3 w-full py-4"
              placeholder=" "
              type="text"
            />
            <label
              className={`absolute peer-focus:bottom-9  peer-focus:text-xs text-sm transition-all duration-200 left-[40%]  lg:left-[45%]  ${
                formData.firstName ? " peer-focus:bottom-9" : "bottom-2"
              }`}
              htmlFor="firstName"
            >
              First Name
            </label>
          </div>
          <div className="relative">
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="border-b peer placeholder:text-xs border-black px-3 w-full py-4"
              placeholder=" "
              type="text"
              id="lastName"
            />
            <label
              className={`absolute peer-focus:bottom-9  peer-focus:text-xs text-sm transition-all duration-200 left-[40%]  lg:left-[45%]  ${
                formData.lastName ? " peer-focus:bottom-9" : "bottom-2"
              }`}
              htmlFor="lastName"
            >
              Last Name
            </label>
          </div>
          <div className="relative">
            <input
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="border-b peer placeholder:text-xs border-black px-3 w-full py-4"
              placeholder=" "
              type="text"
            />
            <label
              className={`absolute peer-focus:bottom-9  peer-focus:text-xs text-sm transition-all duration-200 left-[45%]  ${
                formData.email ? " peer-focus:bottom-9" : "bottom-2"
              }`}
              htmlFor="email"
            >
              Email
            </label>
          </div>
          <div className="relative">
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              id="password"
              className="border-b peer  border-black px-3 w-full py-4"
              type="password"
            />
            <label
              className={`absolute peer-focus:bottom-9  peer-focus:text-xs text-sm transition-all duration-200 left-[45%]  ${
                formData.password ? " peer-focus:bottom-9" : "bottom-2"
              }`}
              htmlFor="password"
            >
              Password
            </label>
          </div>
        </form>
        <button
          onClick={handleSubmit}
          className={`mt-9 uppercase text-md rounded-md font-normal bg-black text-white px-3 py-2 ${
            loading ? "cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <div className="flex items-center">
              <FadeLoader
                className="translate-y-2"
                color="#fff"
                height={4}
                width={1.5}
                margin={-6}
              />
              <div className="pr-3 tracking-tighter text-xs">Creating ....</div>
            </div>
          ) : (
            "Create"
          )}
        </button>
      </div>
    </div>
  );
};

export default Register;
