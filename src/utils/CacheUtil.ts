import cache from 'memory-cache';

function getCachedQuery(key: string) {
    return cache.get(key);
}

function putCachedQuery(key: string, value: any) {
    cache.put(key, value);
}

function deleteKeysWithPattern(patterns: string[]) {
    const allKeys = cache.keys();

    if (allKeys) {
        const keysToDelete: string[] = [];
        allKeys.forEach(key => {
            if (patterns.some(pattern => key.startsWith(pattern))) keysToDelete.push(key);
        });

        keysToDelete.forEach(key => cache.del(key));
    }
}

function cacheClear() {
    cache.clear();
}

export { getCachedQuery, putCachedQuery, deleteKeysWithPattern, cacheClear }