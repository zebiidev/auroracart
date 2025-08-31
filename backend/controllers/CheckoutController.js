import express from "express";
import Stripe from "stripe";
import Checkout from "../models/CheckoutModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // your test secret key

// ✅ Create checkout session
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

    // Save initial checkout in DB (status = pending)
    const createdCheckout = await Checkout.create({
      userId: req.user._id,
      checkoutProducts,
      totalPrice,
      shippingMethod,
      paymentMethod,
      firstName,
      lastName,
      phoneNo,
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
      },
      paymentStatus: "pending",
    });

    // ✅ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: checkoutProducts.map((item) => ({
        price_data: {
          currency: "usd", // ⚠️ use "usd" since PKR isn't supported by Stripe
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100), // ✅ convert to cents & fix float issue
        },
        quantity: item.quantity,
      })),

      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
      metadata: {
        checkoutId: createdCheckout._id.toString(), // link session with your DB entry
      },
    });

    res.status(201).json({
      message: "Stripe session created",
      success: true,
      url: session.url, // frontend redirects user here
      checkout: createdCheckout,
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

      // Find checkout in DB using metadata
      const checkoutId = session.metadata.checkoutId;
      const checkout = await Checkout.findById(checkoutId);

      if (checkout) {
        checkout.paymentStatus = "paid";
        checkout.isPaid = true;
        checkout.paidAt = Date.now();
        await checkout.save();
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
