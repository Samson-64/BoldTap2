declare class MemoryCache {
    private cache;
    private defaultTTL;
    set<T>(key: string, value: T, ttl?: number): void;
    get<T>(key: string): T | null;
    delete(key: string): void;
    clear(): void;
}
export declare const cache: MemoryCache;
export {};
//# sourceMappingURL=cache.d.ts.map