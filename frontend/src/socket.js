import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Adjust as needed

let socket;

export const initSocket = (userId) => {
  if (socket) return socket;
  
  socket = io(SOCKET_URL);

  socket.on('connect', () => {
    console.log('Connected to socket server');
    if (userId) {
      socket.emit('join', userId);
    }
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
