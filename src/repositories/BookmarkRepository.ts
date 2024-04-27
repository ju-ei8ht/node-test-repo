import type { Transaction } from "sequelize";
import { bookmarkS, genreS, webtoonGenreS, webtoonS } from "models/sequelize";
import { createCacheKey, deleteKeysWithPattern, getCachedQuery, putCachedQuery } from "CacheUtils";
import { WebtoonRepository } from "WebtoonRepository";
import { calculateTotalPages, setOffset } from "PaginationUtils";

class BookmarkRepository {

    private static instance: BookmarkRepository;
    public static readonly BOOKMARK_PREFIX = 'BOOKMARKS_';

    private constructor() { }

    public static getInstance(): BookmarkRepository {
        if (this.instance == null) this.instance = new BookmarkRepository();
        return this.instance;
    }

    public async paginateBookmarksIncludeWebtoonWithSequelize(user: string, page: number, size: number) {
        const cacheKey = createCacheKey(BookmarkRepository.BOOKMARK_PREFIX, user, page);

        // 캐시 확인
        const cachedResult = getCachedQuery(cacheKey);
        if (cachedResult) return cachedResult;

        // 캐시 없는 경우
        const offset = setOffset(page, size);
        const result = await bookmarkS.findAndCountAll({
            where: { user },
            include: [{
                model: webtoonS,
                include: [{
                    model: webtoonGenreS,
                    include: [genreS]
                }]
            }],
            limit: size,
            offset: offset,
            order: [
                ['id', 'DESC']
            ]
        });

        const response = calculateTotalPages(size, result);

        // 결과를 캐시에 저장
        putCachedQuery(cacheKey, response);

        return response;
    }

    public async findBookmarkByWebtoonIdAndUserWithSequelize(webtoonId: number, user: string) {
        return await bookmarkS.findOne({ where: { webtoonId, user } })
    }

    public async findBookmarksByUserWithSequelize(user: string) {
        return await bookmarkS.findAll({ where: { user } });
    }

    public async saveWithSequelize(webtoonId: number, user: string, transaction: Transaction) {
        const result = await bookmarkS.create({
            webtoonId: webtoonId,
            user: user
        }, { transaction });

        const keys: string[] = [
            createCacheKey(WebtoonRepository.ALL_PREFIX, user),
            createCacheKey(BookmarkRepository.BOOKMARK_PREFIX, user),
            createCacheKey(WebtoonRepository.DETAILS_PREFIX, user, undefined, webtoonId)
        ]
        deleteKeysWithPattern(keys);

        return result;
    }
}

export { BookmarkRepository }