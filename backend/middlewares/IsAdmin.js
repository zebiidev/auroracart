import User from "../models/UserModel.js";

export const IsAdmin = async (req, res, next) => {
  const _id = req.user._id;

  const isAdmin = await User.findById(_id);

  if (isAdmin && isAdmin.role !== "admin") {
    return res.status(400).json({ message: "Access denied", success: false });
  }

  next();
};
