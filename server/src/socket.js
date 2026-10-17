import { Server } from "socket.io";
import jwt from "jsonwebtoken";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
  });

  // Only logged-in users can connect
  io.use((socket, next) => {
    try {
      const payload = jwt.verify(socket.handshake.auth.token, process.env.ACCESS_SECRET);
      socket.userId = payload.id;
      socket.userName = socket.handshake.auth.name || "Guest";
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join-room", (roomCode) => {
      socket.join(roomCode);
      socket.to(roomCode).emit("system", `${socket.userName} joined`);
    });

    socket.on("chat", ({ roomCode, text }) => {
      if (!text?.trim()) return;
      io.to(roomCode).emit("chat", {
        name: socket.userName,
        text: text.trim(),
        at: Date.now(),
      });
    });

    socket.on("typing", (roomCode) => {
      socket.to(roomCode).emit("typing", socket.userName);
    });

    socket.on("disconnecting", () => {
      for (const room of socket.rooms) {
        socket.to(room).emit("system", `${socket.userName} left`);
      }
    });
  });

  return io;
};