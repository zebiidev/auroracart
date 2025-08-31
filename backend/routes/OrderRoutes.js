import express from "express";
import {
  AllOrders,
  myOrders,
  OrderDetails,
} from "../controllers/OrderController.js";
import IsloggedIn from "../middlewares/IsLoggedIn.js";
import { IsAdmin } from "../middlewares/IsAdmin.js";
const orderRouter = express.Router();

orderRouter.get("/get-my-orders", IsloggedIn, myOrders);
orderRouter.get("/all-orders", IsloggedIn, IsAdmin, AllOrders);
orderRouter.get("/order-Details", IsloggedIn, IsAdmin, OrderDetails);

export default orderRouter;
