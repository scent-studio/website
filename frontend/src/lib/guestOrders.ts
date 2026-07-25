const GUEST_ORDERS_KEY = 'guestOrders';
const MAX_STORED = 20;

export interface GuestOrderRef {
  _id: string;
  total: number;
  email?: string;
  createdAt: string;
}

export function getGuestOrders(): GuestOrderRef[] {
  try {
    const raw = localStorage.getItem(GUEST_ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function rememberGuestOrder(order: GuestOrderRef): void {
  const existing = getGuestOrders().filter((o) => o._id !== order._id);
  const next = [order, ...existing].slice(0, MAX_STORED);
  localStorage.setItem(GUEST_ORDERS_KEY, JSON.stringify(next));
}

export function isGuestOrder(orderId: string): boolean {
  return getGuestOrders().some((o) => o._id === orderId);
}
