import type { Transaction } from "sequelize";
import { bookmarkS, webtoonS } from "models/sequelize";
import { deleteKeysWithPattern, getCachedQuery, putCachedQuery } from "CacheUtil";
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
        const cacheKey = BookmarkRepository.BOOKMARK_PREFIX + user + '_page-' + page;

        // 캐시 확인
        const cachedResult = getCachedQuery(cacheKey);
        if (cachedResult) return cachedResult;

        // 캐시 없는 경우
        const offset = setOffset(page, size);
        const result = await bookmarkS.findAndCountAll({
            where: { user },
            include: [webtoonS],
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

        const keys: string[] = [WebtoonRepository.ALL_PREFIX + user + '_page-', BookmarkRepository.BOOKMARK_PREFIX + user + '_page-', WebtoonRepository.DETAILS_PREFIX + 'id-' + webtoonId + '_' + user]
        deleteKeysWithPattern(keys);

        return result;
    }
}

export { BookmarkRepository }