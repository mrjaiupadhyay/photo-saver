import "dotenv/config";
import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { configureCloudinary } from "./config/cloudinary.js";
import { setupSocket } from "./socket.js";

const start = async () => {
  await connectDB();
  configureCloudinary();

  const port = process.env.PORT || 5000;
  const server = http.createServer(app);
  const io = setupSocket(server);
  app.set("io", io);

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
