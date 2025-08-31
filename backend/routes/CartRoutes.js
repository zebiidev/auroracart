import express from "express";
import {
  AddToCart,
  DecreaseQuantity,
  DeleteItemFromCart,
  GetUserCart,
  IncreaseQuantity,
  MergeCart,
} from "../controllers/CartController.js";
import IsloggedIn from "../middlewares/IsLoggedIn.js";

const cartRouter = express.Router();

cartRouter.post("/add-to-cart", AddToCart);
cartRouter.post("/increase-quantity", IncreaseQuantity);
cartRouter.post("/decrease-quantity", DecreaseQuantity);
cartRouter.post("/del-item-cart", DeleteItemFromCart);
cartRouter.get("/get-user-cart", GetUserCart);
cartRouter.post("/merge-cart", IsloggedIn, MergeCart);

export default cartRouter;
