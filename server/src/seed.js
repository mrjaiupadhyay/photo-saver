import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { Product } from "./models/Product.js";
import { User } from "./models/User.js";

const sampleProducts = [
  {
    name: "Spiral Notebook",
    description: "200-page ruled notebook.",
    category: "stationery",
    price: 60,
    stock: 120,
    imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57",
    tags: ["notebook", "study"]
  },
  {
    name: "Maggi Noodles",
    description: "Instant snack pack.",
    category: "snacks",
    price: 20,
    stock: 300,
    imageUrl: "https://images.unsplash.com/photo-1617093727343-374698b1b08d",
    tags: ["snack", "quick meal"]
  },
  {
    name: "Coke Can",
    description: "330ml chilled drink.",
    category: "snacks",
    price: 40,
    stock: 200,
    imageUrl: "https://images.unsplash.com/photo-1629203432180-71e9b8b8f046",
    tags: ["drink", "cold"]
  },
  {
    name: "Data Structures Book",
    description: "Core CS textbook for semester prep.",
    category: "books",
    price: 499,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
    tags: ["book", "computer science"]
  },
  {
    name: "Toothpaste",
    description: "Daily-use hygiene essential.",
    category: "daily-use",
    price: 95,
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1559591934-7b8d1f31f5f6",
    tags: ["daily use", "hygiene"]
  }
];

const run = async () => {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);

  const admin = await User.findOne({ email: "admin@college.com" });
  if (!admin) {
    await User.create({
      name: "Admin",
      email: "admin@college.com",
      password: "Admin@123",
      role: "admin",
      address: "Campus Store Office"
    });
  }

  console.log("Seed data inserted.");
  await mongoose.connection.close();
};

run().catch(async (err) => {
  console.error(err);
  await mongoose.connection.close();
  process.exit(1);
});
