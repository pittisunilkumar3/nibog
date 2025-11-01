// Shared cache management for API routes
// This allows different API routes to share and invalidate cache

interface CacheEntry {
  data: any;
  timestamp: number;
  cacheKey: string;
}

class CacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  set(key: string, data: any, cacheKey: string): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      cacheKey
    });
    console.log(`Cache: Set cache for key: ${key}`);
  }

  get(key: string, cacheKey: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) {
      console.log(`Cache: No cache found for key: ${key}`);
      return null;
    }

    if (entry.cacheKey !== cacheKey) {
      console.log(`Cache: Cache key mismatch for key: ${key}`);
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > this.CACHE_DURATION) {
      console.log(`Cache: Cache expired for key: ${key}`);
      this.cache.delete(key);
      return null;
    }

    console.log(`Cache: Returning cached data for key: ${key}`);
    return entry.data;
  }

  invalidate(pattern?: string): void {
    if (pattern) {
      // Invalidate all keys matching the pattern
      const keysToDelete: string[] = [];
      this.cache.forEach((_, key) => {
        if (key.includes(pattern)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => this.cache.delete(key));
      console.log(`Cache: Invalidated ${keysToDelete.length} cache entries matching pattern: ${pattern}`);
    } else {
      // Invalidate all cache
      const size = this.cache.size;
      this.cache.clear();
      console.log(`Cache: Invalidated all ${size} cache entries`);
    }
  }

  clear(): void {
    this.cache.clear();
    console.log('Cache: Cleared all cache entries');
  }
}

// Export a singleton instance
export const cacheManager = new CacheManager();

