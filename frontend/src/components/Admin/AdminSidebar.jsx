import React from "react";
import { FaUserAlt, FaBoxOpen } from "react-icons/fa";
import { TbBorderAll } from "react-icons/tb";
import { CiShop } from "react-icons/ci";
import { Link, NavLink } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/AuthSlice";
import { useNavigate } from "react-router-dom";

const AdminSidebar = ({ toggleSideBar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminLinks = [
    { name: "Users", path: "users", image: <FaUserAlt /> },
    { name: "Products", path: "products", image: <FaBoxOpen /> },
    { name: "Orders", path: "orders", image: <TbBorderAll /> },
    { name: "Shops", path: "/", image: <CiShop /> },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div className="w-full z-50">
      <div className="p-6">
        <Link to="/" className="logo text-xl ">
          AURORACART
        </Link>
      </div>
      <Link to="/admin">
        {" "}
        <h1 className="md:px-9 px-8 font-medium tracking-tighter text-lg md:text-xl">
          Admin Dashboard
        </h1>
      </Link>

      <div>
        {adminLinks.map((item, idx) => {
          return (
            <NavLink
              onClick={toggleSideBar}
              to={item.path}
              key={idx}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 my-2 rounded-md py-2 hover:bg-gray-600 mx-4 mt-5 ${
                  isActive ? "bg-gray-600" : ""
                }`
              }
            >
              <div className="text-lg">{item.image}</div>
              <div className="text-lg">{item.name}</div>
            </NavLink>
          );
        })}
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 px-3 py-2 flex items-center justify-center gap-2 w-[70%] mt-5 rounded-md mx-6 hover:bg-red-600"
      >
        <span>
          <MdLogout />
        </span>
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
