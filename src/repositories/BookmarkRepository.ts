import type { Transaction } from "sequelize";
import { bookmarkS } from "../models/sequelize";

class BookmarkRepository {

    private static instance: BookmarkRepository;

    constructor() { }

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
        return await bookmarkS.create({
            webtoonId: webtoonId,
            user: user
        }, { transaction });
    }
}

export { BookmarkRepository }