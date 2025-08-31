import express from "express";
import {
  CreateCheckout,
  StripeWebhook,
} from "../controllers/CheckoutController.js";
import IsloggedIn from "../middlewares/IsLoggedIn.js";

const checkoutRouter = express.Router();

checkoutRouter.post("/create-checkout", IsloggedIn, CreateCheckout);
checkoutRouter.post("/webhook", StripeWebhook);

export default checkoutRouter;
