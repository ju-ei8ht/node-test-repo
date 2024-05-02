import { type Transaction } from "sequelize";
import { genreS, webtoonGenreS, webtoonS } from "models/sequelize";

class GenreRepository {

    private static instance: GenreRepository;

    private constructor() { }

    public static getInstance(): GenreRepository {
        if (this.instance == null) this.instance = new GenreRepository();
        return this.instance;
    }

    public async findAllWithSequelize() {
        return await genreS.findAll();
    }

    public async findGenreByNameWithSequelize(name: string) {
        return await genreS.findOne({ where: { name } });
    }

    public async findWebtoonsByGenre(name: string) {
        return await genreS.findAll({
            where: { name },
            include: [{
                model: webtoonGenreS,
                include: [webtoonS]
            }]
        });
    }

    public async saveWithSequelize(name: string, transaction: Transaction) {
        return await genreS.create({
            name: name
        }, { transaction });
    }
}

export { GenreRepository }