import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";

const getUserCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await cart.populate("items.product");
  }
  return cart;
};

export const getCart = async (req, res) => {
  const cart = await getUserCart(req.user._id);
  res.json(cart);
};

export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const idx = cart.items.findIndex((item) => item.product.toString() === productId);
  if (idx >= 0) cart.items[idx].quantity += Number(quantity);
  else cart.items.push({ product: productId, quantity: Number(quantity) });

  await cart.save();
  const populated = await cart.populate("items.product");
  res.json(populated);
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const cart = await getUserCart(req.user._id);
  cart.items = cart.items.filter((item) => (item.product?._id || item.product).toString() !== productId);
  await cart.save();
  const populated = await cart.populate("items.product");
  res.json(populated);
};

export const updateCartQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await getUserCart(req.user._id);
  const item = cart.items.find((entry) => (entry.product?._id || entry.product).toString() === productId);
  if (!item) return res.status(404).json({ message: "Item not in cart" });
  item.quantity = Math.max(1, Number(quantity));
  await cart.save();
  const populated = await cart.populate("items.product");
  res.json(populated);
};

export const clearCart = async (req, res) => {
  const cart = await getUserCart(req.user._id);
  cart.items = [];
  await cart.save();
  res.json(cart);
};
