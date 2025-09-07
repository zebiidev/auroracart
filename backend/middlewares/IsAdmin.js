import User from "../models/UserModel.js";

export const IsAdmin = async (req, res, next) => {
  const _id = req.user._id;
  const user = await User.findById(_id);

  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Access denied", success: false });
  }

  if (user.email === "demoadmin@auroracart.com" && req.method !== "GET") {
    return res.status(403).json({
      message: "Demo admin has read-only access in the live demo",
      success: false,
    });
  }

  next();
};
