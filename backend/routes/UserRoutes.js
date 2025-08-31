import express from "express";
import { AuthInfo, Login, Register } from "../controllers/AuthController.js";
import IsloggedIn from "../middlewares/IsLoggedIn.js";

const userRouter = express.Router();

userRouter.post("/register", Register);
userRouter.post("/login", Login);
userRouter.get("/auth-info", IsloggedIn, AuthInfo);

export default userRouter;
