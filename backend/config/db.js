import mongoose from "mongoose";

const ConnectingDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to the databse successfully");
  } catch (error) {
    return console.log("Error connecting th database", error);
  }
};

export default ConnectingDb;
