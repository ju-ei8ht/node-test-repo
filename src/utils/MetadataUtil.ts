import * as cheerio from 'cheerio';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { MetadataDTO, PlatformDTO, RegisterDTO, WebtoonDTO, GenreDTO } from 'WebtoonDTO';
import dotenv from 'dotenv';
dotenv.config();

/**
 * 메타데이터 가져오기(네이버, 카카오)
 */
async function getMetadata(url: URL) {
    url.host = replaceHost(url);
    return await axios.get(url.toString())
        .then(async (res: AxiosResponse) => {
            const $ = cheerio.load(res.data);

            const data = await dispatchByPlatform($, url);

            const webtoonImage = $('meta[property="og:image"]').attr('content') as string;
            const desc = $('meta[property="og:description"]').attr('content') as string;

            const webtoon = new WebtoonDTO(0, webtoonImage, data.getTitle(), data.getAuthor(), data.getGenres(), desc);

            return new RegisterDTO(webtoon, data.getPlatform(), data.getGenres());
        }).catch((error: AxiosError) => {
            throw error;
        });
}

function replaceHost(url: URL) {
    if (url.host == 'comic.naver.com') return 'm.comic.naver.com';
    return url.host;
}

async function dispatchByPlatform($: cheerio.CheerioAPI, url: URL): Promise<MetadataDTO> {
    if (url.host.includes('naver')) return getNaver($, url);
    else if (url.host.includes('kakao')) return await getKakao($, url);
    throw new Error('아직 지원하지 않는 플랫폼입니다.');
}

function getNaver($: cheerio.CheerioAPI, url: URL) {
    const platformImage = $('link[rel="shortcut icon"]').attr('href');
    const platformName = $('meta[property="og:article:author"]').attr('content');
    const title = $('meta[property="og:title"]').attr('content');
    const author = $('#ct > div.section_toon_info > div.info_front > div.area_info > span.author').text().trim();
    const genreSelector = '#ct > div.section_toon_info > div.info_back > dl > div.genre > dd';
    const genres = [new GenreDTO($(genreSelector + '> span.length').text())];
    $(genreSelector + '> ul.list_detail > li').each((_, element) => {
        genres.push(new GenreDTO($(element).text()));
    });

    const platform = new PlatformDTO(platformImage as string, platformName as string, url.host);
    return new MetadataDTO(platform, title as string, author, genres);
}

async function getKakao($: cheerio.CheerioAPI, url: URL) {
    const platformName = $('meta[property="og:site_name"]').attr('content');
    const platformImage = url.host + $('link[rel="apple-touch-icon"]').attr('href');
    const title = $('meta[property="og:title"]').attr('content')?.split(' |')[0];
    const author = $('#root > main > div > div > div.relative.z-1.h-87 > div.pt-16.px-11 > p.whitespace-pre-wrap.break-all.break-words.support-break-word.overflow-hidden.text-ellipsis.\!whitespace-nowrap.s12-regular-white.mt-4.opacity-75.text-center.leading-14').text().trim();
    const genreSelector = $('#root > main > div > div > div.relative.z-1.h-87 > div.pt-16.px-11 > div > p:nth-child(2)');
    const genres: GenreDTO[] = [new GenreDTO(genreSelector.text())];

    const platform = new PlatformDTO(platformImage as string, platformName as string, url.host);
    return new MetadataDTO(platform, title as string, author, genres);
}

async function getOriginLink(shortLink: string) {
    try {
        const response = await axios.get('https://unshorten.me/api/v2/unshorten', {
            params: { url: shortLink },
            headers: {
                'Accept-Encoding': 'gzip, deflate', // Brotli 디코딩 비활성화
                Authorization: 'Token ' + process.env.UNSHORTEN_API
            }
        });

        const originLink = response.data.unshortened_url;

        return new URL(originLink);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export { getMetadata, getOriginLink }