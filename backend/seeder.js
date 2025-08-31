import { products } from "./data/Products.js";
import dotenv from "dotenv";
import User from "./models/UserModel.js";
import Product from "./models/ProductModel.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
export const seeder = async () => {
  try {
    dotenv.config();
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany();
    await Product.deleteMany();

    const password = "12345678";

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      firstName: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    const sampleProducts = products.map((item) => {
      return { ...item, user: admin._id };
    });

    await Product.create(sampleProducts);

    console.log("Seeding successful!");
    process.exit();
  } catch (error) {
    console.log("An Error Occured while seeding data", error);
    process.exit(1);
  }
};

seeder();
