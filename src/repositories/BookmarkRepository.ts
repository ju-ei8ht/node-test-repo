import type { Transaction } from "sequelize";
import { bookmarkS } from "models/sequelize";
import { deleteKeysWithPattern } from "CacheUtil";
import { WebtoonRepository } from "WebtoonRepository";

class BookmarkRepository {

    private static instance: BookmarkRepository;

    private constructor() { }

    public static getInstance(): BookmarkRepository {
        if (this.instance == null) this.instance = new BookmarkRepository();
        return this.instance;
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

        const keys: string[] = [WebtoonRepository.ALL_PREFIX + user + '_', WebtoonRepository.BOOKMARK_PREFIX + user + '_']
        deleteKeysWithPattern(keys);

        return result;
    }
}

export { BookmarkRepository }