import { DB, DBManager } from 'configs/db';
import { getMetadata, getOriginLink } from 'MetadataUtil';
import { WebtoonRepository } from 'WebtoonRepository';
import { PlatformRepository } from 'PlatformRepository';
import { LinkRepository } from 'LinkRepository';
import { PlatformDTO, WebtoonDTO, WebtoonDetailsDTO, WebtoonsOutDTO } from 'WebtoonDTO';
import { NotFoundError } from 'ErrorUtils';
import { GenreRepository } from 'repositories/GenreRepository';
import { WebtoonGenreRepository } from 'repositories/WebtoonGenreRepository';

const dbManager = DBManager.getInstance(DB.MySQL);
const webtoonRepository = WebtoonRepository.getInstance();
const platformRepository = PlatformRepository.getInstance();
const linkRepository = LinkRepository.getInstance();
const genreRepository = GenreRepository.getInstance();
const webtoonGenreRepository = WebtoonGenreRepository.getInstance();

/**
 * 웹툰 전체 조회
 */
async function getWebtoons(user: string, page: number, size: number) {
    try {
        const result = await webtoonRepository.paginateWebtoonsIncludeBookmarkWithSequelize(user, page, size);
        const { data, totalPages } = result;
        const webtoons = data.map((webtoon: any) => {
            return new WebtoonDTO(
                webtoon.get().id,
                webtoon.get().image,
                webtoon.get().title,
                webtoon.get().author,
                webtoon.get().webtoon_genres,
                webtoon.get().desc,
                webtoon.get().bookmark
            );
        });
        return new WebtoonsOutDTO(totalPages, webtoons);
    } catch (error) {
        console.error('웹툰 조회 실패:', error);
        throw error;
    }
}

/**
 * 웹툰 상세 조회
 */
async function getWebtoonDetails(id: number, user: string) {
    try {
        const data = await webtoonRepository.findWebtoonIncludeBookmarkAndLinkByIdWithSequelize(id, user);

        if (!data) throw new NotFoundError();

        const { links } = data;

        const webtoon = new WebtoonDTO(
            data.get().id,
            data.get().image,
            data.get().title,
            data.get().author,
            data.get().webtoon_genres,
            data.get().desc,
            data.get().bookmark
        );
        const platforms = links.map((link: any) => {
            const { platform } = link;
            return new PlatformDTO(
                platform.image,
                platform.name,
                platform.host + link.path
            );
        });

        return new WebtoonDetailsDTO(webtoon, platforms);
    } catch (error) {
        console.error('웹툰 상세 조회 실패:', error);
        throw error;
    }
}

/**
 * 웹툰 등록
 */
async function registerWebtoon(url: URL) {
    const sequelize = dbManager.getSequelize();
    const transaction = await sequelize.transaction();

    try {
        if (url.host.includes('naver.me')) url = await getOriginLink(url.toString());
        let path = url.pathname;
        const naverSearchParam = url.searchParams.get('titleId');
        if (naverSearchParam) path = url.pathname + '?titleId=' + naverSearchParam;

        // 이미 등록된 url인지 확인
        const existingUrl = await linkRepository.findLinkByUrlWithSequelize(path);

        if (existingUrl) return existingUrl.get().webtoonId;

        // 아니면 메타데이터 가져오기
        const data = await getMetadata(url);

        // 이미 등록된 웹툰인지 확인
        const title = data.getWebtoon().getTitle();
        let webtoon = await webtoonRepository.findWebtoonByTitleWithSequelize(title);

        // 웹툰 등록
        if (!webtoon) webtoon = await webtoonRepository.saveWithSequelize(data, transaction);

        // 이미 등록된 플랫폼인지 확인
        const name = data.getPlatform().getName();
        let platform = await platformRepository.findPlatformByNameWithSequelize(name);

        // 플랫폼 등록
        if (!platform) platform = await platformRepository.saveWithSequelize(data, transaction);

        const webtoonId = webtoon.get().id;
        const platformId = platform.get().id;

        const genres = data.getGenres();

        // Promise.all을 사용하여 모든 비동기 작업을 병렬로 실행
        await Promise.all(genres.map(async g => {
            let genre = await genreRepository.findGenreByNameWithSequelize(g.getName());
            if (!genre) genre = await genreRepository.saveWithSequelize(g.getName(), transaction);
            await webtoonGenreRepository.saveWithSequelize(webtoonId, genre.get().id, transaction);
        }));

        // 관계 설정
        await linkRepository.saveWithSequelize(path, webtoonId, platformId, transaction);

        await transaction.commit();

        return webtoonId;
    } catch (error) {
        await transaction.rollback();
        console.error('웹툰 등록 실패:', error);
        throw error;
    }
}

export { getWebtoons, getWebtoonDetails, registerWebtoon }