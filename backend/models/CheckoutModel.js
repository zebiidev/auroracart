import mongoose from "mongoose";

const checkoutItem = new mongoose.Schema(
  {
    name: String,
    image: String,
    price: { type: Number, required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    size: String,
    color: String,
  },
  { _id: false }
);

const checkoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    checkoutProducts: [checkoutItem],

    paymentMethod: {
      type: String,
      enum: ["cod", "card"],
      default: "cod",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      default: "Pending",
    },
    paidAt: {
      type: Date,
    },

    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    shippingMethod: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Checkout = mongoose.model("Checkout", checkoutSchema);

export default Checkout;
