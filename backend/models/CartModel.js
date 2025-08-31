import mongoose from "mongoose";
const { Schema } = mongoose; // get Schema from mongoose

const cartItem = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    name: String,
    size: String,
    color: String,
    price: Number,
    quantity: {
      type: Number,
      default: 1,
    },
    image: String,
  },
  { _id: false }
);

const cart = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    guestId: {
      type: Schema.Types.Mixed,
      required: false,
    },
    products: [cartItem],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("cart", cart);

export default Cart;
