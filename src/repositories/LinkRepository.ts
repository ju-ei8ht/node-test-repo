import type { Transaction } from "sequelize";
import { linkS } from "../models/sequelize";

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

    public async findLinkByUrlWithSequelize(url: string) {
        return await linkS.findOne({ where: { url } });
    }

    public async saveWithSequelize(url: string, webtoonId: number, platformId: number, transaction: Transaction) {
        return await linkS.create({
            url: url,
            webtoonId: webtoonId,
            platformId: platformId
        }, { transaction });
    }
}

export { LinkRepository }