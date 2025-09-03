import Product from "../models/ProductModel.js";
import imageKit from "../config/imageKit.js";
import fs from "fs";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import Order from "../models/OrderModel.js";

export const AddProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      numReviews,
    } = req.body;

    const files = req.files;

    const images = [];

    await Promise.all(
      files.map(async (file) => {
        const buffer = fs.readFileSync(file.path);
        const uploaded = await imageKit.upload({
          file: buffer,
          fileName: file.originalname,
          folder: "/auroracartimages",
        });
        images.push({
          url: uploaded.url,
          altText: file.originalname || name,
        });
      })
    );

    const newProduct = await Product.create({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      numReviews,
      images,
      user: req.user._id,
    });

    if (!newProduct) {
      return res
        .status(400)
        .json({ message: "Unable to Add New Product", success: false });
    }

    res.status(201).json({
      message: "New product created successfully",
      success: true,
      newProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const EditProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      numReviews,
      existingImages, // <-- comes from formData
    } = req.body;

    const files = req.files;
    const newImages = [];

    // Handle new uploads
    if (files && files.length > 0) {
      await Promise.all(
        files.map(async (file) => {
          const buffer = await fs.promises.readFile(file.path);
          const uploaded = await imageKit.upload({
            file: buffer,
            fileName: file.originalname,
            folder: "/auroracartimages",
          });
          newImages.push({
            url: uploaded.url,
            altText: file.originalname || name,
          });
        })
      );
    }

    // Ensure existingImages is always an array
    let parsedExisting = [];
    if (existingImages) {
      if (Array.isArray(existingImages)) {
        parsedExisting = existingImages.map((img) =>
          typeof img === "string" ? { url: img, altText: name } : img
        );
      } else {
        parsedExisting = [
          typeof existingImages === "string"
            ? { url: existingImages, altText: name }
            : existingImages,
        ];
      }
    }

    // Merge both
    const finalImages = [...parsedExisting, ...newImages];

    const updateData = {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      numReviews,
      images: finalImages, // ✅ merge old + new
      user: req.user._id,
    };

    const EditedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!EditedProduct) {
      return res
        .status(400)
        .json({ message: "Unable to edit product", success: false });
    }

    res.status(200).json({
      message: "Product edited successfully",
      success: true,
      product: EditedProduct,
      id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const delProduct = await Product.findByIdAndDelete(id);

    if (!delProduct) {
      return res
        .status(400)
        .json({ message: "Unable to delete product", success: false });
    }

    res
      .status(200)
      .json({ message: "Product deleted successfully", success: true, id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const AddNewUser = async (req, res) => {
  try {
    const { firstName, email, password, role } = req.body;

    if (!firstName || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const isExisting = await User.findOne({ email });

    if (isExisting) {
      return res
        .status(400)
        .json({ message: "OOPS! email already registered", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      email,
      role,
      password: hashedPassword,
    });

    if (!newUser) {
      return res
        .status(400)
        .json({ message: "Unable to add new User", success: false });
    }

    res
      .status(201)
      .json({ message: "New user added successfully", success: true, newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const DeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const delUser = await User.findByIdAndDelete(id);

    if (!delUser) {
      return res
        .status(400)
        .json({ message: "Unable to delete user", success: false });
    }

    res
      .status(200)
      .json({ message: "User deleted successfully", success: true, id });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const FetchAllUser = async (req, res) => {
  try {
    const user = await User.find().sort({ createdAt: -1 });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Unavble to fetch all users", success: false });
    }

    res.status(200).json({ message: "All users", success: true, user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const SearchUser = async (req, res) => {
  try {
    const { firstName, email } = req.query;

    let filter = [];

    if (firstName)
      filter.push({ firstName: { $regex: firstName, $options: "i" } });

    if (email) filter.push({ email: { $regex: email, $options: "i" } });

    const filteredUser = await User.find({ $or: filter });

    if (filteredUser.length === 0) {
      return res.status(400).json({ message: "No user found", success: false });
    }

    res
      .status(200)
      .json({ message: "Searched User", success: true, filteredUser });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const Revenue = async (req, res) => {
  try {
    let paidOrders = await Order.find({ paymentStatus: "paid" });

    const totalRevenue = paidOrders.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    if (!totalRevenue) {
      return res
        .status(400)
        .json({ message: "Unable to calculate revenue", success: false });
    }

    res.status(200).json({
      message: "Total revenue of yuor store",
      success: true,
      totalRevenue,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
