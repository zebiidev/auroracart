import express from "express";
import {
  AllOrders,
  DeleteOrder,
  myOrders,
  OrderDetails,
  UpdateOrderStatus,
} from "../controllers/OrderController.js";
import IsloggedIn from "../middlewares/IsLoggedIn.js";
import { IsAdmin } from "../middlewares/IsAdmin.js";
const orderRouter = express.Router();

orderRouter.get("/get-my-orders", IsloggedIn, myOrders);
orderRouter.get("/all-orders", IsloggedIn, IsAdmin, AllOrders);
orderRouter.get("/order-Details/:id", IsloggedIn, IsAdmin, OrderDetails);
orderRouter.delete("/del-order/:id", IsloggedIn, IsAdmin, DeleteOrder);
orderRouter.put("/update-order-status", IsloggedIn, IsAdmin, UpdateOrderStatus);

export default orderRouter;
