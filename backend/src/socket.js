const { Server } = require("socket.io");

let io;
const userSockets = new Map(); // userId -> [socketId1, socketId2, ...]

const init = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join", (userId) => {
      if (userId) {
        socket.userId = userId;
        const previouslyOffline = !userSockets.has(userId);
        
        if (previouslyOffline) {
          userSockets.set(userId, []);
        }
        userSockets.get(userId).push(socket.id);
        
        if (previouslyOffline) {
          io.emit('user_status_changed', { userId, status: 'online' });
        }

        // Send current online users to the newly joined user
        socket.emit('online_users_list', Array.from(userSockets.keys()));
        console.log(`User ${userId} joined [STATUS: ONLINE]`);
      }
    });

    socket.on("disconnect", () => {
      if (socket.userId && userSockets.has(socket.userId)) {
        const sockets = userSockets.get(socket.userId);
        const index = sockets.indexOf(socket.id);
        if (index > -1) sockets.splice(index, 1);
        
        if (sockets.length === 0) {
          userSockets.delete(socket.userId);
          io.emit('user_status_changed', { userId: socket.userId, status: 'offline' });
          console.log(`User ${socket.userId} disconnected [STATUS: OFFLINE]`);
        }
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

const getOnlineUsers = () => Array.from(userSockets.keys());

const emitToUser = (userId, event, data) => {
  if (userSockets.has(userId)) {
    const sockets = userSockets.get(userId);
    sockets.forEach((socketId) => {
      io.to(socketId).emit(event, data);
    });
  }
};

module.exports = { init, getIO, emitToUser, getOnlineUsers };
