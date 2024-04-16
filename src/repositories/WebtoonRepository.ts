import type { Transaction } from "sequelize";
import type { RegisterDTO } from "../dtos/WebtoonDTO";
import { bookmarkS, webtoonS } from "../models/sequelize";
import { deleteKeyWithPattern, getCachedQuery, putCachedQuery } from "../utils/CacheUtil";

class WebtoonRepository {

    private static instance: WebtoonRepository;
    public static readonly ALL_PREFIX = 'WEBTOONS_';

    private constructor() { }

    public static getInstance(): WebtoonRepository {
        if (this.instance == null) this.instance = new WebtoonRepository();
        return this.instance;
    }

    public async paginateAllWebtoonsIncludeBookmarkWithSequelize(user: string, pageNumber: number, pageSize: number) {
        const cacheKey = WebtoonRepository.ALL_PREFIX + user + '_' + pageNumber;

        // 캐시 확인
        const cachedResult = getCachedQuery(cacheKey);
        if (cachedResult) return cachedResult;

        // 캐시 없는 경우
        const offset = (pageNumber - 1) * pageSize;
        const result = await webtoonS.findAndCountAll({
            include: [{
                model: bookmarkS,
                where: { user },
                required: false
            }],
            limit: pageSize,
            offset: offset
        });

        // 총 페이지 수 계산
        const totalCount = result.count;
        const totalPages = Math.ceil(totalCount / pageSize);

        // 결과와 총 페이지 수를 함께 반환
        const response = {
            data: result.rows,
            totalPages: totalPages
        }

        // 결과를 캐시에 저장
        putCachedQuery(cacheKey, response);

        return response;
    }

    public async findWebtoonByTitleWithSequelize(title: string) {
        return await webtoonS.findOne({ where: { title } })
    }

    public async saveWithSequelize(data: RegisterDTO, transaction: Transaction) {
        console.log("WEBTOON CACHE DELETE");

        const result = await webtoonS.create({
            image: data.getWebtoon().getImage(),
            title: data.getWebtoon().getTitle(),
            author: data.getWebtoon().getAuthor(),
            desc: data.getWebtoon().getDesc()
        }, { transaction });

        deleteKeyWithPattern(WebtoonRepository.ALL_PREFIX);

        return result;
    }
}

export { WebtoonRepository }