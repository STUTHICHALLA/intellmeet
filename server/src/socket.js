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

    // WebRTC signaling: the server only relays small messages between peers
    socket.on("rtc-ready", (roomCode) => {
      socket.to(roomCode).emit("rtc-peer-joined", socket.id);
    });

    socket.on("rtc-offer", ({ to, offer }) => {
      io.to(to).emit("rtc-offer", { from: socket.id, offer });
    });

    socket.on("rtc-answer", ({ to, answer }) => {
      io.to(to).emit("rtc-answer", { from: socket.id, answer });
    });

    socket.on("rtc-ice", ({ to, candidate }) => {
      io.to(to).emit("rtc-ice", { from: socket.id, candidate });
    });

    socket.on("rtc-leave", (roomCode) => {
      socket.to(roomCode).emit("rtc-peer-left", socket.id);
    });

    socket.on("disconnecting", () => {
      for (const room of socket.rooms) {
        socket.to(room).emit("system", `${socket.userName} left`);
        socket.to(room).emit("rtc-peer-left", socket.id);
      }
    });
  });

  return io;
};