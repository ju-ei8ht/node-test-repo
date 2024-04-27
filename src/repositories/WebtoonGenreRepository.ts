import type { Transaction } from "sequelize";
import { webtoonGenreS } from "models/sequelize";

class WebtoonGenreRepository {

    private static instance: WebtoonGenreRepository;

    private constructor() { }

    public static getInstance(): WebtoonGenreRepository {
        if (this.instance == null) this.instance = new WebtoonGenreRepository();
        return this.instance;
    }

    public async saveWithSequelize(webtoonId: number, genreId: number, transaction: Transaction) {
        return await webtoonGenreS.create({
            webtoonId: webtoonId,
            genreId: genreId
        }, { transaction });
    }
}

export { WebtoonGenreRepository }