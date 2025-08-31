import Order from "../models/OrderModel.js";

export const myOrders = async (req, res) => {
  try {
    const myOrders = await Order.findById({ user: req.user._id }).sort({
      createdAt: -1,
    });

    if (!myOrders) {
      return res
        .status(404)
        .json({ message: "Orders not found", success: false });
    }

    res.status(200).json({ message: "Your orders", success: true, myOrders });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const OrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const orderDetails = await Order.findById(id).populate(
      "user",
      "name email"
    );

    if (!orderDetails) {
      return res
        .status(404)
        .json({ message: "Order details not found", success: false });
    }

    res
      .status(200)
      .json({ message: "Order details", success: true, orderDetails });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const AllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find().sort({ createdAt: -1 });

    if (!allOrders) {
      return res
        .status(500)
        .json({ message: "Unable to fetch all orders", success: false });
    }

    res.status(200).json({ message: "All orders ", success: true, allOrders });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
