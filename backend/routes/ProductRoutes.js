import express from "express";
import {
  GetAllProducts,
  GetFilteredProducts,
  GetSingleProduct,
  SearchedProduct,
} from "../controllers/ProductController.js";

const productRouter = express.Router();

productRouter.get("/all-products", GetAllProducts);
productRouter.get("/single-product/:id", GetSingleProduct);
productRouter.get("/searched-product", SearchedProduct);
productRouter.get("/filtered-products", GetFilteredProducts);

export default productRouter;
