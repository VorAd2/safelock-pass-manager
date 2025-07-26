import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

export const socket = io(SOCKET_URL, {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
  transports: ['websocket'],
});

export const registerSocket = (username) => {
  if (!socket.connected){
    socket.connect()
    socket.emit('register', username)
    console.log('Socket não estava conectado')
  } else {
    socket.emit('register', username)
    console.log('Socket já estava conectado')
  }
  
};
