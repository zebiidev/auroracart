import React, { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { RiMenuFold2Fill } from "react-icons/ri";

const AdminLayout = () => {
  const [openSideBar, setOpenSidebar] = useState(false);
  const sidebarRef = useRef();

  const toggleSideBar = () => {
    setOpenSidebar(!openSideBar);
  };

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setOpenSidebar(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openSideBar]);

  return (
    <>
      <div className="md:hidden flex items-center gap-5 text-xl bg-black text-white p-5">
        <div onClick={toggleSideBar}>
          <RiMenuFold2Fill />
        </div>
        <h1>Admin Dashboard</h1>
      </div>

      <div className="flex relative min-h-screen">
        {openSideBar && (
          <div className="fixed md:hidden inset-0 bg-black/40"></div>
        )}

        <div
          ref={sidebarRef}
          className={`lg:w-[20vw] md:w-[35vw] z-50 bg-black transition-all md:translate-x-0 duration-500 text-white fixed md:fixed top-0 left-0 bottom-0 w-[60vw] ${
            openSideBar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AdminSidebar toggleSideBar={toggleSideBar} />
        </div>

        <div className="grow md:ml-[35vw] lg:ml-[20vw] p-4 overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
