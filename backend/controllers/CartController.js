import Cart from "../models/CartModel.js";
import Product from "../models/ProductModel.js";

const getUserCart = async (userId, guestId) => {
  if (userId) return await Cart.findOne({ userId });
  if (guestId) return await Cart.findOne({ guestId });
  return null;
};

export const AddToCart = async (req, res) => {
  try {
    const { userId, guestId, productId, size, color, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    let cart = await getUserCart(userId, guestId);

    if (cart) {
      const productIndex = cart.products.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.size === size &&
          item.color === color
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();

      return res.status(200).json({
        message: "Product added to existing cart",
        success: true,
        cart,
      });
    } else {
      cart = await Cart.create({
        userId,
        guestId,
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });

      return res.status(201).json({
        message: "New cart created and product added",
        success: true,
        cart,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const IncreaseQuantity = async (req, res) => {
  try {
    const { productId, userId, guestId, quantity, size, color } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    const cart = await getUserCart(userId, guestId);

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });
    }

    if (cart) {
      const produtIndex = cart.products.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.color === color &&
          item.size === size
      );
      if (produtIndex > -1) {
        cart.products[produtIndex].quantity += 1;
      } else {
        return res
          .status(404)
          .json({ message: "Product not founded in the cart", success: false });
      }
    }

    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    return res.status(200).json({
      message: "Quantity updated successfully",
      success: true,
      cart,
      totalPrice: cart.totalPrice,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const DecreaseQuantity = async (req, res) => {
  try {
    const { productId, userId, guestId, quantity, size, color } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    const cart = await getUserCart(userId, guestId);

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });
    }

    if (cart) {
      const produtIndex = cart.products.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.color === color &&
          item.size === size
      );
      if (produtIndex > -1) {
        cart.products[produtIndex].quantity -= 1;
      } else {
        return res
          .status(404)
          .json({ message: "Product not founded in the cart", success: false });
      }
    }

    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    return res.status(200).json({
      message: "Quantity updated successfully",
      success: true,
      cart,
      totalPrice: cart.totalPrice,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const DeleteItemFromCart = async (req, res) => {
  try {
    const { userId, productId, size, color, guestId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    const cart = await getUserCart(userId, guestId);

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    const productIndex = cart.products.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.color === color &&
        item.size === size
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
    } else {
      return res
        .status(404)
        .json({ message: "Product not found in the cart", success: false });
    }

    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    return res.status(200).json({
      message: "Item removed successfully",
      success: true,
      cart,
      productId,
      totalPrice: cart.totalPrice,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const GetUserCart = async (req, res) => {
  try {
    const { guestId, userId } = req.query;

    const userCart = await getUserCart(userId, guestId);

    if (!userCart) {
      return res
        .status(400)
        .json({ message: "Your cart is empty", success: false });
    }

    res
      .status(200)
      .json({ message: "Cart fetched successfully", success: true, userCart });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const MergeCart = async (req, res) => {
  try {
    const { guestId } = req.body;

    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ userId: req.user._id });

    if (!guestCart) {
      return res
        .status(400)
        .json({ message: "No guest cart found", success: false });
    }

    if (userCart) {
      guestCart.products.forEach((guestItem) => {
        const productIndex = userCart.products.findIndex(
          (item) =>
            item.productId.toString() === guestItem.productId.toString() &&
            item.size === guestItem.size &&
            item.color === guestItem.color
        );

        if (productIndex > -1) {
          userCart.products[productIndex].quantity += guestItem.quantity;
        } else {
          userCart.products.push(guestItem);
        }
      });

      userCart.totalPrice = userCart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await userCart.save();
      await Cart.deleteOne({ guestId });

      return res.status(200).json({
        message: "Cart merged successfully",
        cart: userCart,
        success: true,
      });
    } else {
      guestCart.userId = req.user._id;
      guestCart.guestId = null;
      await guestCart.save();

      return res.status(200).json({
        message: "Guest cart assigned to user",
        cart: guestCart,
        success: true,
      });
    }
  } catch (error) {
    console.log("Error merging carts", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
