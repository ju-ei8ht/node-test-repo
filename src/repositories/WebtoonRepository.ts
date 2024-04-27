import type { Transaction } from "sequelize";
import type { RegisterDTO } from "WebtoonDTO";
import { bookmarkS, genreS, linkS, platformS, webtoonGenreS, webtoonS } from "models/sequelize";
import { createCacheKey, deleteKeysWithPattern, getCachedQuery, putCachedQuery } from "CacheUtils";
import { calculateTotalPages, setOffset } from "PaginationUtils";

class WebtoonRepository {

    private static instance: WebtoonRepository;
    public static readonly ALL_PREFIX = 'WEBTOONS_';
    public static readonly DETAILS_PREFIX = 'DETAILS_';

    private constructor() { }

    public static getInstance(): WebtoonRepository {
        if (this.instance == null) this.instance = new WebtoonRepository();
        return this.instance;
    }

    public async paginateWebtoonsIncludeBookmarkWithSequelize(user: string, page: number, size: number) {
        const cacheKey = createCacheKey(WebtoonRepository.ALL_PREFIX, user, page);

        // 캐시 확인
        const cachedResult = getCachedQuery(cacheKey);
        if (cachedResult) return cachedResult;

        // 캐시 없는 경우
        const offset = setOffset(page, size);
        const result = await webtoonS.findAndCountAll({
            include: [{
                model: bookmarkS,
                where: { user },
                required: false
            }, {
                model: webtoonGenreS,
                include: [genreS]
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

    public async findWebtoonIncludeBookmarkAndLinkByIdWithSequelize(id: number, user: string) {
        const cacheKey = createCacheKey(WebtoonRepository.DETAILS_PREFIX, user, undefined, id);

        // 캐시 확인
        const cachedResult = getCachedQuery(cacheKey);
        if (cachedResult) return cachedResult;

        // 캐시 없는 경우
        const result = await webtoonS.findOne({
            where: { id },
            include: [{
                model: bookmarkS,
                where: { user },
                required: false
            }, {
                model: linkS,
                include: [platformS]
            }, {
                model: webtoonGenreS,
                include: [genreS]
            }]
        });

        // 결과를 캐시에 저장
        putCachedQuery(cacheKey, result);

        return result;
    }

    public async findWebtoonByTitleWithSequelize(title: string) {
        return await webtoonS.findOne({ where: { title } })
    }

    public async saveWithSequelize(data: RegisterDTO, transaction: Transaction) {
        const result = await webtoonS.create({
            image: data.getWebtoon().getImage(),
            title: data.getWebtoon().getTitle(),
            author: data.getWebtoon().getAuthor(),
            desc: data.getWebtoon().getDesc()
        }, { transaction });

        deleteKeysWithPattern([WebtoonRepository.ALL_PREFIX]);

        return result;
    }
}

export { WebtoonRepository }