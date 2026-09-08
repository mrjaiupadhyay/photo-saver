import { Server } from "socket.io";

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.on("joinUserRoom", (userId) => {
      if (userId) socket.join(userId);
    });
  });

  return io;
};
