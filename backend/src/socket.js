const { Server } = require("socket.io");

let io;
const userSockets = new Map(); // userId -> [socketId1, socketId2, ...]

const init = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust this in production
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join", (userId) => {
      if (userId) {
        socket.userId = userId;
        if (!userSockets.has(userId)) {
          userSockets.set(userId, []);
        }
        userSockets.get(userId).push(socket.id);
        console.log(`User ${userId} joined with socket ${socket.id}`);
      }
    });

    socket.on("disconnect", () => {
      if (socket.userId && userSockets.has(socket.userId)) {
        const sockets = userSockets.get(socket.userId);
        const index = sockets.indexOf(socket.id);
        if (index > -1) {
          sockets.splice(index, 1);
        }
        if (sockets.length === 0) {
          userSockets.delete(socket.userId);
        }
      }
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

const emitToUser = (userId, event, data) => {
  if (userSockets.has(userId)) {
    const sockets = userSockets.get(userId);
    sockets.forEach((socketId) => {
      io.to(socketId).emit(event, data);
    });
  }
};

module.exports = { init, getIO, emitToUser };
