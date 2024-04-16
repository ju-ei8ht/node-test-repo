import cache from 'memory-cache';

function getCachedQuery(key: string) {
    return cache.get(key);
}

function putCachedQuery(key: string, value: any) {
    cache.put(key, value);
}

function deleteKeyWithPattern(pattern: string) {
    const allKeys = cache.keys();

    if (allKeys) {
        const keysToDelete = allKeys.filter(key => key.startsWith(pattern));
        keysToDelete.forEach(key => cache.del(key));
    }
}

export { getCachedQuery, putCachedQuery, deleteKeyWithPattern }