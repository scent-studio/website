import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getAdminSocket(): Socket {
  if (!socket) {
    const url = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    socket = io(url, {
      auth: { token: localStorage.getItem('token') },
      transports: ['websocket', 'polling'],
    });
    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket?.id);
    });
    socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message);
    });
  }
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
