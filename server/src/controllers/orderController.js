import mongoose from "mongoose";
import { Cart } from "../models/Cart.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { sendOrderNotification } from "../services/notificationService.js";

export const createOrder = async (req, res) => {
  const { deliveryAddress } = req.body;
  if (!deliveryAddress) return res.status(400).json({ message: "Delivery address is required" });

  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

  const orderItems = [];
  let total = 0;

  for (const item of cart.items) {
    if (!item.product || item.product.stock < item.quantity) {
      return res.status(400).json({ message: `Insufficient stock for ${item.product?.name || "item"}` });
    }

    item.product.stock -= item.quantity;
    await item.product.save();

    orderItems.push({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    });
    total += item.product.price * item.quantity;
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount: total,
    deliveryAddress
  });

  cart.items = [];
  await cart.save();

  await sendOrderNotification({
    to: req.user.email,
    subject: "Order placed successfully",
    text: `Your order ${order._id} has been placed. Total: INR ${order.totalAmount}.`
  });

  req.app.get("io").to(req.user._id.toString()).emit("orderStatusUpdate", order);
  res.status(201).json(order);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  if (!["placed", "processing", "out_for_delivery", "delivered", "cancelled"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: "Order not found" });
  req.app.get("io").to(order.user.toString()).emit("orderStatusUpdate", order);
  res.json(order);
};

export const getRecommendations = async (req, res) => {
  const pipeline = [
    { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
    { $unwind: "$items" },
    { $group: { _id: "$items.product", count: { $sum: "$items.quantity" } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ];

  const topOrdered = await Order.aggregate(pipeline);
  const ids = topOrdered.map((item) => item._id);
  const products = await Product.find({ _id: { $in: ids } });
  res.json(products);
};
