import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
const IsloggedIn = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    const token = header && header.split(" ")[1];
    if (!token || token === "undefined") {
      return res
        .status(400)
        .json({ message: "Missing token header", success: false });
    }

    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedUser._id).select("-password");

    req.user = user;
    next();
  } catch (error) {
    console.log("Error occured in the userinfomiddleware", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export default IsloggedIn;
