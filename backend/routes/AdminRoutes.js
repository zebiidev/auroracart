import express from "express";
import IsloggedIn from "../middlewares/IsLoggedIn.js";
import { IsAdmin } from "../middlewares/IsAdmin.js";
import {
  AddNewUser,
  AddProduct,
  DeleteProduct,
  DeleteUser,
  EditProduct,
  FetchAllUser,
  SearchUser,
} from "../controllers/AdminController.js";
import upload from "../middlewares/upload.js";
const adminRouter = express.Router();

adminRouter.post(
  "/add-product",
  IsloggedIn,
  IsAdmin,
  upload.array("images"),
  AddProduct
);

adminRouter.put(
  "/edit-product/:id",
  IsloggedIn,
  IsAdmin,
  upload.array("images"),
  EditProduct
);
adminRouter.delete("/del-product/:id", IsloggedIn, IsAdmin, DeleteProduct);

adminRouter.post("/add-user", IsloggedIn, IsAdmin, AddNewUser);
adminRouter.delete("/del-user/:id", IsloggedIn, IsAdmin, DeleteUser);
adminRouter.get("/get-all-users", IsloggedIn, IsAdmin, FetchAllUser);
adminRouter.get("/searched-user", IsloggedIn, IsAdmin, SearchUser);

export default adminRouter;
