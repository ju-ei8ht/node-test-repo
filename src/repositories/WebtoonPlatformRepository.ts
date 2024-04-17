import type { Transaction } from "sequelize";
import { webtoonPlatformS } from "models/sequelize";
import { deleteKeysWithPattern } from "CacheUtil";
import { WebtoonRepository } from "WebtoonRepository";

class WebtoonPlatformRepository {

    private static instance: WebtoonPlatformRepository;

    private constructor() { }

    public static getInstance(): WebtoonPlatformRepository {
        if (this.instance == null) this.instance = new WebtoonPlatformRepository();
        return this.instance;
    }

    public async findWebtoonPlatformByWebtoonIdAndPlatformIdWithSequelize(webtoonId: number, platformId: number) {
        return await webtoonPlatformS.findOne({ where: { webtoonId, platformId } })
    }

    public async saveWithSequelize(webtoonId: number, platformId: number, transaction: Transaction) {
        const result = await webtoonPlatformS.create({
            webtoonId: webtoonId,
            platformId: platformId
        }, { transaction });

        deleteKeysWithPattern([WebtoonRepository.DETAILS_PREFIX + 'id-' + webtoonId + '_']);

        return result;
    }
}

export { WebtoonPlatformRepository }