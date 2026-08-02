const PREFIX = 'api-cache:';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export function getCached<T>(key: string): T | undefined {
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    if (!raw) return undefined;
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() > entry.expiresAt) {
      sessionStorage.removeItem(PREFIX + key);
      return undefined;
    }
    return entry.value;
  } catch {
    return undefined;
  }
}

export function setCached<T>(key: string, value: T, ttlMs = 120000): void {
  try {
    const entry: CacheEntry<T> = { value, expiresAt: Date.now() + ttlMs };
    sessionStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {
    // storage full / unavailable — ignore
  }
}
