import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

const NavbarDrawer = ({ toggleMobilenav, setLoader, handleLogout, loader }) => {
  const navigate = useNavigate();

  const navLinks = [
    { name: "All Collection", path: "/collection" },
    { name: "My Orders", path: "/my-orders" },
    { name: "View cart", path: "/cart" },
    { name: "Checkout", path: "/checkout" },
  ];

  const { user } = useSelector((state) => state.auth);

  return (
    <div className="relative">
      <div className="absolute right-7 top-6 text-3xl">
        <IoCloseSharp onClick={toggleMobilenav} />
      </div>

      <div className="flex flex-col pt-16 px-4 gap-5">
        {navLinks.map((links, idx) => (
          <NavLink
            className={({ isActive }) =>
              isActive ? "underline font-semibold" : ""
            }
            onClick={toggleMobilenav}
            key={idx}
            to={links.path}
          >
            {links.name}
          </NavLink>
        ))}

        {/* 👇 Admin button will show right before Login */}
        {user && user.role === "admin" && (
          <button
            onClick={() => {
              toggleMobilenav();
              navigate("/admin");
            }}
            className="bg-black text-white tracking-tighter text-sm px-2 py-2 rounded-md hover:bg-black/90"
          >
            Go to admin dashboard
          </button>
        )}

        {/* Login always comes last */}
        {user && user ? (
          loader ? (
            <button
              disabled={loader}
              className={`bg-black text-white py-2 rounded-md ${
                loader ? "bg-black/90 cursor-not-allowed" : ""
              }`}
            >
              Loggingout...
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-black text-white py-2 rounded-md"
            >
              Logout
            </button>
          )
        ) : (
          <NavLink
            className={({ isActive }) =>
              isActive ? "underline font-semibold" : ""
            }
            onClick={toggleMobilenav}
            to="/login"
          >
            LogIn
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default NavbarDrawer;
