import { BookmarkRepository } from 'BookmarkRepository';
import { WebtoonRepository } from 'WebtoonRepository';
import cache from 'memory-cache';

function createCacheKey(prefix: string, user?: string, page?: number, id?: number) {
    let pattern = prefix + 'id-' + id + '_';

    if (!user) return pattern;

    if (prefix == WebtoonRepository.ALL_PREFIX || prefix == BookmarkRepository.BOOKMARK_PREFIX) {
        pattern = prefix + user + '_page-';

        if (!page) return pattern;
        
        return pattern + page;
    }

    return pattern + user;
}

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

export { createCacheKey, getCachedQuery, putCachedQuery, deleteKeysWithPattern, cacheClear }