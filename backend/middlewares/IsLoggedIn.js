import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const IsloggedIn = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    const token = header && header.split(" ")[1];
    if (!token || token === "undefined") {
      return res.status(401).json({
        message: "Missing or invalid token. Please login again.",
        success: false,
      });
    }

    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedUser._id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found. Please login again.",
        success: false,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in IsloggedIn middleware:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired. Please login again.",
        success: false,
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token. Please login again.",
        success: false,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export default IsloggedIn;
