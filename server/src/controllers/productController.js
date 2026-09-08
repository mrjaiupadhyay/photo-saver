import { Product } from "../models/Product.js";
import { cloudinary } from "../config/cloudinary.js";

export const listProducts = async (req, res) => {
  const { q, category, minPrice, maxPrice } = req.query;
  const filter = {};

  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
};

export const uploadProductImage = async (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ message: "Image payload is required" });

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return res.status(400).json({ message: "Cloudinary is not configured" });
  }

  const result = await cloudinary.uploader.upload(image, {
    folder: "college-supply-products"
  });

  res.status(201).json({ imageUrl: result.secure_url });
};
