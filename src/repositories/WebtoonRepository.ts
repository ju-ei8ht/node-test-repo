import type { Transaction } from "sequelize";
import type { RegisterDTO } from "WebtoonDTO";
import { bookmarkS, platformS, webtoonPlatformS, webtoonS } from "models/sequelize";
import { cacheClear, getCachedQuery, putCachedQuery } from "CacheUtil";

class WebtoonRepository {

    private static instance: WebtoonRepository;
    public static readonly ALL_PREFIX = 'WEBTOONS_';
    public static readonly BOOKMARK_PREFIX = 'BOOKMARKS_';
    public static readonly DETAILS_PREFIX = 'DETAILS_';

    private constructor() { }

    public static getInstance(): WebtoonRepository {
        if (this.instance == null) this.instance = new WebtoonRepository();
        return this.instance;
    }

    public async paginateWebtoonsIncludeBookmarkWithSequelize(select: Select, user: string, page: number, size: number) {
        let prefix = WebtoonRepository.ALL_PREFIX;
        if (select == Select.BOOKMARK) prefix = WebtoonRepository.BOOKMARK_PREFIX;
        const cacheKey = prefix + user + '_' + page;

        const required = select == Select.BOOKMARK;

        // 캐시 확인
        const cachedResult = getCachedQuery(cacheKey);
        if (cachedResult) return cachedResult;

        // 캐시 없는 경우
        const offset = (page - 1) * size;
        const result = await webtoonS.findAndCountAll({
            include: [{
                model: bookmarkS,
                where: { user },
                required: required
            }],
            limit: size,
            offset: offset
        });

        // 총 페이지 수 계산
        const totalCount = result.count;
        const totalPages = Math.ceil(totalCount / size);

        // 결과와 총 페이지 수를 함께 반환
        const response = {
            data: result.rows,
            totalPages: totalPages
        }

        // 결과를 캐시에 저장
        putCachedQuery(cacheKey, response);

        return response;
    }

    public async findWebtoonIncludePlatformByIdWithSequelize(id: number, user: string) {
        const cacheKey = WebtoonRepository.DETAILS_PREFIX + user;

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
                include: [platformS]
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

        cacheClear();

        return result;
    }
}

export enum Select {
    ALL,
    BOOKMARK
}

export { WebtoonRepository }