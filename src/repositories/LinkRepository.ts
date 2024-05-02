import type { Transaction } from "sequelize";
import { linkS } from "models/sequelize";

class LinkRepository {

    private static instance: LinkRepository;

    private constructor() { }

    public static getInstance(): LinkRepository {
        if (this.instance == null) this.instance = new LinkRepository();
        return this.instance;
    }

    public async findLinkByWebtoonIdAndPlatformIdWithSequelize(webtoonId: number, platformId: number) {
        return await linkS.findOne({ where: { webtoonId, platformId } })
    }

    public async findLinkByUrlWithSequelize(path: string) {
        return await linkS.findOne({ where: { path } });
    }

    public async saveWithSequelize(path: string, webtoonId: number, platformId: number, transaction: Transaction) {
        return await linkS.create({
            path: path,
            webtoonId: webtoonId,
            platformId: platformId
        }, { transaction });
    }
}

export { LinkRepository }