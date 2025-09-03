import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { assets } from "../assets/assets";
import OrderSumary from "../components/OrderSumary";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { CreateCheckout } from "../redux/slices/CheckoutSlice";
import { toast } from "react-toastify";
const Checkout = () => {
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [cityChosenFromList, setCityChosenFromList] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);

  const { userCart } = useSelector((state) => state.cart);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  let products = userCart?.products;

  const cities = [
    "Select city from dropdown",
    "Karachi",
    "Lahore",
    "Islamabad",
    "Faisalabad",
    "Rawalpindi",
    "Multan",
    "Sahiwal",
    "Hyderabad",
    "Peshawar",
    "Quetta",
    "Gujranwala",
    "Sialkot",
  ];

  const toggleSearchBox = () => {
    setShowSearchBox(!showSearchBox);
    setShowDropdown(true);
    setSelectedCity("");
    setCityChosenFromList(false);
    setFilteredCities(cities.slice(1));
  };

  const handleCitySearch = (e) => {
    const value = e.target.value;
    setSelectedCity(value);

    if (value.trim() === "") {
      setFilteredCities(cities.slice(1));
    } else {
      const filtered = cities
        .slice(1)
        .filter((city) => city.toLowerCase().includes(value.toLowerCase()));
      setFilteredCities(filtered);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user?.email,
    },
  });

  const paymentMethod = watch("payment");
  const shipping = watch("shipping");

  const onSubmit = async (data) => {
    let totalPrice = userCart?.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    if (shipping === "flat") {
      totalPrice += 250;
    } else {
      totalPrice += 1;
    }

    totalPrice = parseFloat(totalPrice.toFixed(2));

    if (paymentMethod === "cod") {
      dispatch(CreateCheckout({ formData: data, products, totalPrice }));
    } else if (paymentMethod === "card") {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/checkout/create-checkout`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              checkoutProducts: products,
              totalPrice,
              paymentMethod,
              firstName: data.firstName,
              lastName: data.lastName,
              phoneNo: data.phoneNo,
              shippingAddress: data.shippingAddress,
              shippingMethod: shipping,
            }),
          }
        );

        const result = await response.json();

        if (result.success && result.url) {
          window.location.href = result.url; // ✅ redirect to Stripe Checkout
        } else {
          toast.error("Failed to initiate Stripe checkout. Try again.");
        }
      } catch (error) {
        console.error("Stripe Checkout Error:", error);
        toast.error("Something went wrong with payment.");
      }
    }
  };

  return (
    <div className="w-full flex md:flex-row overflow-x-hidden gap-6 md:gap-0 justify-center flex-col">
      <div className="w-full lg:pl-[80px] p-7 md:p-0 md:mx-4 md:w-1/2">
        <div className="flex md:mt-4 justify-between">
          <h1 className="text-2xl font-medium">Contact</h1>
          <a className="text-blue-500 underline" href="/login">
            Login
          </a>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <input
            disabled={true}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            type="text"
            className="rounded-md px-3 py-3 placeholder:text-black/90 placeholder:text-sm border focus:outline-none focus:outline-blue-400 mt-4 w-full"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          {/* News and offers */}
          <div className="mt-4 flex items-center">
            <input
              {...register("newsOffers")}
              id="confirmation"
              className="py-2 w-4 h-4 cursor-pointer"
              type="checkbox"
            />
            <label className="px-3 cursor-pointer" htmlFor="confirmation">
              Email me with news and offers
            </label>
          </div>

          {/* Delivery */}
          <h1 className="text-2xl font-medium mt-6">Delivery</h1>

          {/* City Selector */}
          <div className="w-full mt-4 justify-between items-center gap-2 flex">
            {showSearchBox ? (
              <input
                disabled={cityChosenFromList}
                value={selectedCity}
                onChange={handleCitySearch}
                className="w-full focus:ring-1 focus:ring-blue-400 outline-none border px-3 rounded-md py-3"
                type="text"
                placeholder="City Search"
              />
            ) : (
              <select
                {...register("shippingAddress.city", {
                  required: "City is required",
                })}
                className="w-full outline-none border px-3 rounded-md py-3"
              >
                {cities.map((city, idx) => (
                  <option
                    className={`${idx === 0 ? "text-gray-500" : ""}`}
                    key={idx}
                    value={city}
                  >
                    {city}
                  </option>
                ))}
              </select>
            )}
            <div
              onClick={toggleSearchBox}
              className="border px-3 py-3 cursor-pointer text-xl rounded-md"
            >
              {showSearchBox ? <IoMdClose /> : <CiSearch />}
            </div>
          </div>
          {errors.shippingAddress?.city && (
            <p className="text-red-500 text-sm">
              {errors.shippingAddress.city.message}
            </p>
          )}

          {/* Search dropdown list */}
          <div
            className={`px-3 overflow-y-auto transition-all duration-500 bg-[#f5f5f5] ${
              showDropdown && showSearchBox ? "h-[200px]" : "h-0"
            }`}
          >
            {filteredCities.map((city, idx) => (
              <div
                onClick={() => {
                  setSelectedCity(city);
                  setShowDropdown(false);
                  setCityChosenFromList(true);
                  setValue("shippingAddress.city", city);
                }}
                className="py-2 hover:bg-gray-200 cursor-pointer"
                key={idx}
              >
                {city}
              </div>
            ))}
          </div>

          {/* First & Last Name */}
          <div className="grid mt-3 gap-3 grid-cols-1 md:grid-cols-2">
            <input
              {...register("firstName", { required: "First name is required" })}
              className="px-3 py-2 focus:outline-none border rounded-md"
              type="text"
              placeholder="First name"
            />
            <input
              {...register("lastName", { required: "Last name is required" })}
              className="px-3 py-2 focus:outline-none border rounded-md"
              type="text"
              placeholder="Last name"
            />
          </div>
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}

          {/* Address */}
          <input
            {...register("shippingAddress.address", {
              required: "Address is required",
            })}
            className="px-3 w-full mt-3 py-2 focus:outline-none border rounded-md"
            type="text"
            placeholder="Address"
          />
          {errors.shippingAddress?.address && (
            <p className="text-red-500 text-sm">
              {errors.shippingAddress.address.message}
            </p>
          )}

          {/* City + Postal Code */}
          <div className="w-full mt-3 gap-3 ">
            <input
              {...register("shippingAddress.postalCode")}
              className="px-3 py-2 w-full focus:outline-none border rounded-md"
              type="text"
              placeholder="Postal code(optional)"
            />
          </div>

          {/* Phone Number */}
          <input
            {...register("phoneNo", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: "Enter a valid phone number",
              },
            })}
            className="px-3 w-full mt-3 py-2 focus:outline-none border rounded-md"
            type="number"
            placeholder="Phone"
          />
          {errors.phoneNo && (
            <p className="text-red-500 text-sm">{errors.phoneNo.message}</p>
          )}

          {/* Shipping Method */}
          <div className="mt-3">
            <h1 className="text-xl font-semibold mb-2">Shipping Method</h1>
            <div className="flex flex-col items-start gap-2">
              <label className="flex justify-between items-center w-full border rounded-md px-3 py-3 cursor-pointer hover:border-blue-400">
                <div className="flex items-start gap-3">
                  <input
                    {...register("shipping", {
                      required: "Shipping method is required",
                    })}
                    type="radio"
                    value="flat"
                    className="mt-1 accent-blue-500"
                    defaultChecked
                  />
                  <div>
                    <p className="font-medium">
                      FLAT SHIPPING 249 PKR + FBR POS FEE 1 PKR
                    </p>
                    <p className="text-sm text-gray-500">
                      Cash on Delivery (COD)
                    </p>
                  </div>
                </div>
                <p className="font-medium">Rs 250.00</p>
              </label>

              <label className="flex justify-between items-center w-full border rounded-md px-3 py-3 cursor-pointer hover:border-blue-400">
                <div className="flex items-start gap-3">
                  <input
                    {...register("shipping", {
                      required: "Shipping method is required",
                    })}
                    type="radio"
                    value="free"
                    className="mt-1 accent-blue-500"
                  />
                  <div>
                    <p className="font-medium ">
                      FREE SHIPPING + FBR POS FEE 1 PKR
                    </p>
                    <p className="text-sm text-gray-500">Debit - Credit Card</p>
                  </div>
                </div>
                <p className="font-medium">Rs 1.00</p>
              </label>
            </div>
            {errors.shipping && (
              <p className="text-red-500 text-sm">{errors.shipping.message}</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="mt-3">
            <h1 className="text-xl font-semibold mb-2">Payment Method</h1>
            <p className="text-sm font-light">
              All transactions are secure and encrypted.
            </p>
            <label className="w-full px-3 py-3 border gap-4 cursor-pointer mt-3 rounded-md flex ">
              <input
                {...register("payment", {
                  required: "Payment method is required",
                })}
                type="radio"
                value="cod"
                defaultChecked
              />
              <span>Cash on Delivery (COD)</span>
            </label>
            <label className="w-full px-3 py-3 border gap-4 cursor-pointer mt-3 rounded-md justify-between items-center flex ">
              <div className="flex gap-3">
                <input
                  {...register("payment", {
                    required: "Payment method is required",
                  })}
                  type="radio"
                  value="card"
                />
                <span>Debit - Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <img src={assets.visa} alt="visacard" />
                <img src={assets.mastercard} alt="mastercard" />
              </div>
            </label>
            {errors.payment && (
              <p className="text-red-500 text-sm">{errors.payment.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#1773b0] hover:bg-[#1773b0]/90 text-white mt-3 py-3 rounded-md font-medium"
          >
            {paymentMethod === "cod" ? "Complete Order" : "Pay Now"}
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="w-full md:overflow-y-auto md:w-1/2 bg-white md:pt-9 md:px-14 px-4 md:bg-[#f5f5f5] ">
        <OrderSumary shipping={shipping} />
      </div>
    </div>
  );
};

export default Checkout;
