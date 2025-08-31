import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/AuthSlice";
import FadeLoader from "react-spinners/FadeLoader";
import { MergeCart } from "../redux/slices/CartSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  const { loading, guestId } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const handleChange = (e) => {
    const value = e.target.value;
    const { name } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error("Please fill both the fields");
    }

    if (formData.password.length < 8) {
      toast.error("Paswword contains at least 8 characters");
    }
    dispatch(login(formData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(MergeCart({ guestId }));
      }
    });
  };
  return (
    <div className="w-full h-[100vh] flex justify-center  mt-16">
      <div className="flex w-full flex-col items-center">
        <h1 className="text-4xl font-bold">Login</h1>
        <form
          onSubmit={handleSubmit}
          className="md:w-1/3 w-full flex flex-col gap-7 px-4 md:px-0 mt-9"
        >
          <div className="relative">
            <input
              name="email"
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

          <button
            disabled={loading}
            className={`flex items-center justify-center gap-2 bg-black text-white  mx-auto py-2 rounded-md mt-5 disabled:opacity-85 ${
              loading ? "cursor-not-allowed " : "w-1/3"
            }`}
          >
            {loading ? (
              <>
                <div className="translate-y-2 w-1/3 pl-3">
                  <FadeLoader
                    color="#fff"
                    height={4} // smaller bar height
                    width={1.5} // thinner bars
                    margin={-6} // controls spacing between bars (negative reduces it)
                  />
                </div>
                <div className="pr-3 tracking-tighter text-sm">
                  Signing in....
                </div>
              </>
            ) : (
              "Signup"
            )}
          </button>
        </form>
        <button
          onClick={() => navigate("/register")}
          className="mt-9 uppercase text-md font-normal"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default Login;
