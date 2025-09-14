import Order from "../models/OrderModel.js";

export const myOrders = async (req, res) => {
  try {
    const id = req.user._id;
    const myOrders = await Order.find({ user: id }).sort({
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
      "name email createdAt firstName"
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
    const allOrders = await Order.find()
      .populate("user", "firstName")
      .sort({ createdAt: -1 });

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

export const DeleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const del = await Order.findByIdAndDelete(id);

    if (!del) {
      return res
        .status(400)
        .json({ message: "Unable to delete order", success: false });
    }

    res
      .status(200)
      .json({ message: "Order deleted successfully", id, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const UpdateOrderStatus = async (req, res) => {
  try {
    const { updatedStatus, id } = req.query;

    const updatingStatus = await Order.findByIdAndUpdate(
      id,
      {
        status: updatedStatus,
      },
      { new: true }
    );

    if (!updatingStatus) {
      return res
        .status(400)
        .json({ message: "Internal server error", success: false });
    }

    res.status(200).json({
      message: "Status Updated Succesfully",
      success: true,
      id,
      updatedStatus,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const GetOrderThisMonth = async (req, res) => {
  try {
    const totalOrders = await Order.aggregate([
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

    if (!totalOrders || totalOrders.length === 0) {
      return res
        .status(400)
        .json({ message: "Unabe to get orders", success: false });
    }

    res
      .status(200)
      .json({ message: "Your orders", success: true, totalOrders });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
