import type { Transaction } from "sequelize";
import type { RegisterDTO } from "WebtoonDTO";
import { bookmarkS, linkS, platformS, webtoonPlatformS, webtoonS } from "models/sequelize";
import { deleteKeysWithPattern, getCachedQuery, putCachedQuery } from "CacheUtil";
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
        const cacheKey = WebtoonRepository.ALL_PREFIX + user + '_page-' + page;

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

    public async findWebtoonIncludePlatformAndLinkByIdWithSequelize(id: number, user: string) {
        const cacheKey = WebtoonRepository.DETAILS_PREFIX + 'id-' + id + '_' + user;

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
                model: webtoonPlatformS,
                include: [{
                    model: platformS,
                    include: [{
                        model: linkS,
                        where: { webtoonId: id }
                    }]
                }]
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