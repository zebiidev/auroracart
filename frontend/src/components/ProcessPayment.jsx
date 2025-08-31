// import { toast } from "react-toastify";

// export const processPayment = async ({
//   paymentMethod,
//   products,
//   formData,
//   totalPrice,
// }) => {
//   if (paymentMethod === "cod") {
//     alert(
//       `Order placed successfully with Cash on Delivery! Total: Rs${totalPrice}`
//     );
//     return;
//   }

//   if (paymentMethod === "card") {
//     const token = JSON.parse(localStorage.getItem("token"));

//     if (!token) {
//       return toast.error("Please login first to proceede payment ");
//     }
//     const response = await fetch(
//       "https://your-backend.onrender.com/api/checkout/create-checkout",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           checkoutProducts: products,
//           totalPrice,
//           paymentMethod: "card",
//           formData,
//         }),
//       }
//     );

//     const data = await response.json();
//     const { fields, signature } = data;

//     // ✅ Build PayFast form
//     const form = document.createElement("form");
//     form.method = "POST";
//     form.action = "https://sandbox.payfast.co.za/eng/process";

//     Object.entries({ ...fields, signature }).forEach(([name, value]) => {
//       const input = document.createElement("input");
//       input.type = "hidden";
//       input.name = name;
//       input.value = value;
//       form.appendChild(input);
//     });

//     document.body.appendChild(form);
//     form.submit();
//   }
// };
