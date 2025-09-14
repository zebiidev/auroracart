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
    const now = new Date();

    // 🔹 Calculate date ranges
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    // 🔹 Monthly Revenue
    const revenueMonthly = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const revenueToday = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    // 🔹 All-Time Revenue
    const total = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: null,
          allTimeRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    // 🔹 Extract values (default to 0 if empty)
    const monthlyRevenue = revenueMonthly[0]?.total || 0;
    const todayRevenue = revenueToday[0]?.total || 0;
    const allTimeRevenue = total[0]?.allTimeRevenue || 0;

    return res.status(200).json({
      message: "Stats",
      revenueMonthly: monthlyRevenue, // same name, cleaned value
      revenueToday: todayRevenue, // new field
      total: allTimeRevenue, // same name, cleaned value
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const GetAllAdminProduct = async (req, res) => {
  try {
    const adminPrd = await Product.find().sort({ createdAt: -1 });

    if (!adminPrd) {
      return res.status(400).json({
        message: "Unable to fetch all products admin",
        success: false,
      });
    }

    res.status(200).json({ message: "All products", success: true, adminPrd });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const GetUserThisMonth = async (req, res) => {
  try {
    const monthlyUser = await User.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: "$createdAt" }, { $month: "$$NOW" }] },
              { $eq: [{ $year: "$createdAt" }, { $year: "$$NOW" }] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);

    if (!monthlyUser || monthlyUser.length === 0) {
      return res.status(400).json({
        message: "No users found",
        success: false,
        monthlyUser,
      });
    }

    res.status(200).json({
      message: "Users registered monthly",
      success: true,
      monthlyUser,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const StockAlert = async (req, res) => {
  try {
    const stockCount = await Product.aggregate([
      { $match: { countStock: { $lt: 7 } } },
      { $group: { _id: null, total: { $sum: 1 } } },
    ]);

    const total = stockCount[0]?.total || 0;

    res.status(200).json({
      message: "Low stock count",
      success: true,
      total,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const TrendingProduct = async (req, res) => {
  try {
    let trendingProducts = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.productId",
          name: { $first: "$orderItems.name" },
          image: { $first: "$orderItems.image" },
          totalOrdered: { $sum: "$orderItems.quantity" },
        },
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: 5 },
    ]);

    if (!trendingProducts || trendingProducts.length === 0) {
      return res.status(400).json({
        message: "Internal server error",
        success: false,
      });
    }

    res
      .status(200)
      .json({ message: "Trending products", success: true, trendingProducts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const MonthlySales = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $match: { paymentStatus: "paid" },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const formatted = sales.map((s) => ({
      month: `${s._id.month}-${s._id.year}`,
      total: s.total,
    }));

    res.status(200).json({ success: true, sales: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const OrderStatus = async (req, res) => {
  try {
    const orderstatuses = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    if (!orderstatuses || orderstatuses.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Unable to count orders" });
    }

    res
      .status(200)
      .json({ message: "Your orders", success: true, orderstatuses });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const TotalOrdersThisMonth = async (req, res) => {
  try {
    // Get the first day of the current month
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    // Get the first day of the next month
    const startOfNextMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1
    );

    // Count orders between start and end of current month
    const totalOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
    });

    res.status(200).json({
      success: true,
      message: "Total orders for the current month",
      totalOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
