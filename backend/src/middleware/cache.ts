const cache = new Map<string, { value: any; expiresAt: number }>();

const DEFAULT_TTL_MS = 60 * 1000;

const getCache = (key: string) => {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return entry.value;
};

const setCache = (key: string, value: any, ttlMs = DEFAULT_TTL_MS) => {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
};

const clearCache = () => cache.clear();

const clearCachePrefix = (prefix: string) => {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
};

const cacheMiddleware = (ttlMs = DEFAULT_TTL_MS) => {
  return (req: any, res: any, next: any) => {
    if (req.method !== 'GET') return next();
    res.setHeader('Cache-Control', `public, s-maxage=${Math.floor(ttlMs / 1000)}, max-age=${Math.floor(ttlMs / 1000)}`);
    const key = req.originalUrl;
    const cached = getCache(key);
    if (cached) {
      return res.status(200).json(cached);
    }
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      setCache(key, body, ttlMs);
      return originalJson(body);
    };
    next();
  };
};

module.exports = { cacheMiddleware, clearCache, clearCachePrefix };
export {};
