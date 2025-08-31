import Order from "../models/OrderModel.js";
import Checkout from "../models/CheckoutModel.js";
import stripe from "../config/stripe.js";

export const CreateCheckout = async (req, res) => {
  try {
    const {
      checkoutProducts,
      totalPrice,
      paymentMethod,
      firstName,
      lastName,
      phoneNo,
      shippingAddress,
      shippingMethod,
    } = req.body;

    if (!checkoutProducts || checkoutProducts.length === 0) {
      return res
        .status(400)
        .json({ message: "No checkout products provided", success: false });
    }

    if (!firstName || !lastName || !phoneNo) {
      return res
        .status(400)
        .json({ message: "Missing required customer info", success: false });
    }

    if (
      !shippingAddress ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        message: "Shipping address is incomplete",
        success: false,
      });
    }

    // ✅ Step 1: Save Checkout
    const createdCheckout = await Checkout.create({
      userId: req.user._id,
      checkoutProducts,
      totalPrice,
      shippingMethod,
      paymentMethod,
      firstName,
      lastName,
      phoneNo,
      shippingAddress,
      paymentStatus: "pending",
    });

    // ✅ Step 2: Create Order (linked with checkout)
    const createdOrder = await Order.create({
      user: req.user._id,
      orderItems: checkoutProducts,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "pending",
      status: "Processing",
    });

    // ✅ Step 3: If Card payment → Stripe Session
    let sessionUrl = null;
    if (paymentMethod === "card") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: checkoutProducts.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: { name: item.name },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}/cancel`,
        metadata: {
          checkoutId: createdCheckout._id.toString(),
          orderId: createdOrder._id.toString(),
        },
      });

      sessionUrl = session.url;
    }

    res.status(201).json({
      message: "Checkout created",
      success: true,
      checkout: createdCheckout,
      order: createdOrder,
      url: sessionUrl,
    });
  } catch (error) {
    console.error("CreateCheckout error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const StripeWebhook = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Get IDs from metadata
      const checkoutId = session.metadata.checkoutId;
      const orderId = session.metadata.orderId;

      // ✅ Update Checkout
      const checkout = await Checkout.findById(checkoutId);
      if (checkout) {
        checkout.paymentStatus = "paid";
        checkout.isPaid = true;
        checkout.paidAt = Date.now();
        await checkout.save();
      }

      // ✅ Update Order
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = "paid";
        order.paidAt = Date.now();
        await order.save();
      }
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Stripe Webhook Error:", error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

export const UpdateCheckout = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const { id } = req.params;

    const checkout = await Checkout.findById(id);

    if (!checkout) {
      return res
        .status(404)
        .json({ message: "Unable to find Checkout", success: false });
    }

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = "Paid";
      checkout.paidAt = Date.now();
    } else {
      checkout.paymentStatus = paymentStatus || "Pending";
    }

    await checkout.save();

    res.status(200).json({
      message: "Checkout updated successfully",
      success: true,
      checkout,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
