import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const Register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const isExisting = await User.findOne({ email });

    if (isExisting) {
      return res.status(400).json({
        message: "OOPS! Email already registered try different one",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const registeredUser = await User.create({
      firstName,
      email,
      password: hashedPassword,
    });

    if (!registeredUser) {
      return res.status(400).json({
        message: "OOPS! A problem occured unable to register user",
        success: false,
      });
    }

    const token = jwt.sign(
      {
        _id: registeredUser._id,
        email: registeredUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: " Registered Successfully",
      success: true,
      registeredUser,
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password bith are required",
        success: false,
      });
    }

    const isUser = await User.findOne({ email });

    if (!isUser) {
      return res.status(400).json({
        message: "Invalid Credentials",
        success: false,
      });
    }

    const comparedPassword = await bcrypt.compare(password, isUser.password);

    if (!comparedPassword) {
      return res.status(400).json({
        message: "Invalid Credentials",
        success: false,
      });
    }

    const token = jwt.sign(
      { _id: isUser._id, email: isUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "LoggedIn Successfully",
      success: true,
      token,
      isUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const AuthInfo = async (req, res) => {
  try {
    const userInfo = await User.findById(req.user._id).select("-password");

    if (!userInfo) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    res.status(200).json({
      message: "User info fetched successfully",
      success: true,
      userInfo,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
