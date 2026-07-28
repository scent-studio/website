import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const noop = { on: () => {}, off: () => {}, emit: () => {}, disconnect: () => {} } as any;

export function getAdminSocket(): Socket {
  if (socket) return socket;

  const url = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  if (url.includes('vercel.app') || url === '' || url === '/api') {
    return noop;
  }

  try {
    socket = io(url, {
      auth: { token: localStorage.getItem('token') },
      transports: ['websocket', 'polling'],
      timeout: 5000,
      reconnection: false,
    });

    socket.on('connect', () => console.log('[Socket] Connected:', socket?.id));
    socket.on('connect_error', () => {});
  } catch {
    return noop;
  }

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
