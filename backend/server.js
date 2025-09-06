import express from "express";
import dotenv from "dotenv";
import ConnectingDb from "./config/db.js";
import userRouter from "./routes/UserRoutes.js";
import productRouter from "./routes/ProductRoutes.js";
import cartRouter from "./routes/CartRoutes.js";
import adminRouter from "./routes/AdminRoutes.js";
import checkoutRouter from "./routes/CheckoutRoutes.js";
import qs from "qs";
import orderRouter from "./routes/OrderRoutes.js";
import cors from "cors";
import bodyParser from "body-parser";
import { StripeWebhook } from "./controllers/CheckoutController.js";
import helmet from "helmet";
import compression from "compression";

const app = express();

dotenv.config();

app.post(
  "/api/checkout/webhook",
  bodyParser.raw({ type: "application/json" }),
  StripeWebhook
);

app.use(helmet());
app.use(compression());
app.use(cors());
app.set("query parser", (str) => qs.parse(str));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Auroracart Backend running");
});

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/admin", adminRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/order", orderRouter);

ConnectingDb();
app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});
