import React, { useState, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { IoBagHandleOutline } from "react-icons/io5";
import CartDrawer from "./CartDrawer";
import SearchbarDrawer from "./SearchbarDrawer";
import Hero from "./Hero";
import { useLocation } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import NavbarDrawer from "./NavbarDrawer";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/AuthSlice";
import { toast } from "react-toastify";
import FadeLoader from "react-spinners/FadeLoader";
const Navbar = () => {
  const [openCartDrawer, setOpenCartDrawer] = useState(false);
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [navWhite, setNavWhite] = useState(false);
  const [openMobileNav, setOpenMobileNav] = useState(false);
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef();

  const toggleCartDrawer = () => setOpenCartDrawer(!openCartDrawer);
  const closeCartDrawer = () => setOpenCartDrawer(false);
  const toggleSearchBar = () => setOpenSearchBar(!openSearchBar);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (location.pathname === "/") {
      const handleScroll = () => {
        const heroHeight =
          document.querySelector("#hero-section")?.offsetHeight || 0;
        if (window.scrollY < heroHeight - 50) {
          setNavWhite(true);
        } else {
          setNavWhite(false);
        }
      };

      handleScroll();
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setNavWhite(false);
    }
  }, [location]);

  const toggleMobilenav = () => {
    setOpenMobileNav(!openMobileNav);
  };

  const handleClickOutside = (e) => {
    if (navRef.current && !navRef.current.contains(e.target)) {
      setOpenMobileNav(false);
    }
  };

  const { userCart } = useSelector((state) => state.cart);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMobileNav]);

  const handleLogout = () => {
    setLoader(true);
    const handleLogOutRequest = setTimeout(() => {
      dispatch(logout());
      toast.success("Logged out successfully");
      setLoader(false);
    }, 3000);

    return () => clearTimeout(handleLogOutRequest);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-[999] max-w-full p-4 md:p-6 flex   items-center justify-between transition-colors duration-300 ${
          navWhite ? "  md:text-white" : "md:text-black"
        }`}
      >
        <div>
          <Link to="/">
            <div className="logo md:text-3xl   text-xl">AURORACART</div>
          </Link>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div
            onClick={toggleSearchBar}
            className="md:flex items-center hidden md:gap-4"
          >
            <input
              onClick={toggleSearchBar}
              className={`w-full cursor-pointer py-2 bg-transparent  text-sm outline-none border-b ${
                navWhite
                  ? ""
                  : "placeholder:text-black border-b-black placeholder:border-b-black"
              }`}
              type="text"
              placeholder="SEARCH"
            />
          </div>
          {user && user ? (
            loader ? (
              <button
                disabled={loader}
                className={`md:text-xs  md:block hidden text-lg ${
                  loader ? " cursor-not-allowed px-2 py-2" : ""
                }`}
              >
                <span> Logging Out...</span>
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="md:text-xs md:block hidden text-lg"
              >
                Log Out
              </button>
            )
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="md:text-xs md:block hidden text-lg"
            >
              LOG IN
            </button>
          )}
          <Link to="/collection">
            {" "}
            <button
              // onClick={() => navigate("/collection")}
              className="text-lg md:block hidden md:text-sm"
            >
              All Collections
            </button>
          </Link>
          <button
            onClick={() => navigate("/cart")}
            className="md:text-sm md:block hidden text-lg"
          >
            View cart
          </button>
          <div
            onClick={toggleCartDrawer}
            className="text-xs md:block hidden cursor-pointer"
          >
            SHOPPING BAG [{userCart?.products?.length}]
          </div>
          {user && user.role === "admin" ? (
            <button
              onClick={() => navigate("/admin")}
              className="bg-black text-white hidden md:block tracking-tighter text-sm px-2 py-2 rounded-md hover:bg-black/90"
            >
              Go to admin dashboard
            </button>
          ) : (
            ""
          )}

          <div
            onClick={toggleCartDrawer}
            className="text-[20px] relative md:hidden block cursor-pointer"
          >
            <IoBagHandleOutline />
            <div className="rounded-full bg-black text-white flex items-center justify-center absolute w-3 md:w-[40vw] text-[6px] h-3 right-0 top-3">
              {userCart?.products?.length}
            </div>
          </div>
          <div className="md:hidden block text-4xl">
            {openMobileNav ? (
              <IoCloseSharp onClick={toggleMobilenav} />
            ) : (
              <IoIosMenu onClick={toggleMobilenav} />
            )}
          </div>
        </div>
      </div>
      <div className="absolute top-16 w-full z-[998] p-4 md:hidden block left-0 ">
        <input
          onClick={toggleSearchBar}
          type="text"
          placeholder="Search"
          className="placeholder:text-black py-2 outline-none border px-3 rounded-md border-black w-full"
        />
      </div>
      {/* Cart overlay */}
      <div
        className={`fixed inset-0 z-[1000]  transition-opacity duration-500 ${
          openCartDrawer
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCartDrawer}
      >
        <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>
      </div>

      <div
        className={`fixed top-0 right-0 h-screen overflow-y-auto z-[1000] bg-white shadow-lg transition-transform duration-500 ease-in-out w-[80vw] md:w-[35vw]  ${
          openCartDrawer ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <CartDrawer toggleCartDrawer={toggleCartDrawer} />
      </div>

      <div
        className={`fixed inset-0 w-full h-full overflow-y-auto z-[2000] transition-transform duration-500 ${
          openSearchBar
            ? "translate-y-0 pointer-events-auto"
            : "-translate-y-full pointer-events-none"
        }`}
      >
        <SearchbarDrawer toggleSearchBar={toggleSearchBar} />
      </div>

      {location.pathname === "/" && (
        <div
          id="hero-section"
          className="absolute  top-0 right-0 left-0 max-w-full"
        >
          <Hero />
        </div>
      )}
      <div
        ref={navRef}
        className={`fixed right-0 top-0 bottom-0 w-[70vw] transition-transform duration-500 ease-out bg-white z-[1000] ${
          openMobileNav ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <NavbarDrawer
          toggleMobilenav={toggleMobilenav}
          setLoader={setLoader}
          handleLogout={handleLogout}
          loader={loader}
        />
      </div>
    </>
  );
};

export default Navbar;
