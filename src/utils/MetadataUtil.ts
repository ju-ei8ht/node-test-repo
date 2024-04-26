import * as cheerio from 'cheerio';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { MetadataDTO, LinkDTO, RegisterDTO, WebtoonDTO } from 'WebtoonDTO';
import dotenv from 'dotenv';
dotenv.config();

/**
 * 메타데이터 가져오기(네이버, 카카오)
 */
async function getMetadata(url: URL) {
    return await axios.get(url.toString())
        .then((res: AxiosResponse) => {
            const $ = cheerio.load(res.data);

            const data = dispatchByPlatform($, url);

            const webtoonImage = $('meta[property="og:image"]').attr('content') as string;
            const desc = $('meta[property="og:description"]').attr('content') as string;

            const webtoon = new WebtoonDTO(0, webtoonImage, data.getTitle(), data.getAuthor(), desc);

            return new RegisterDTO(webtoon, data.getPlatform());
        }).catch((error: AxiosError) => {
            throw error;
        });
}

function dispatchByPlatform($: cheerio.CheerioAPI, url: URL): MetadataDTO {
    if (url.origin.includes('naver')) return getNaver($);
    else if (url.origin.includes('kakao')) return getKakao($, url);
    throw new Error('아직 지원하지 않는 플랫폼입니다.');
}

function getNaver($: cheerio.CheerioAPI) {
    const platformImage = $('link[rel="shortcut icon"]').attr('href');
    const platformName = $('meta[property="og:article:author"]').attr('content');
    const platformUrl = $('meta[property="og:article:author:url"]').attr('content');
    const title = $('meta[property="og:title"]').attr('content');
    const author = $('#ct > div.section_toon_info > div.info_front > div.area_info > span.author').text().trim();

    const platform = new LinkDTO(platformImage as string, platformName as string, platformUrl as string);
    return new MetadataDTO(platform, title as string, author);
}

function getKakao($: cheerio.CheerioAPI, url: URL) {
    const platformName = $('meta[property="og:site_name"]').attr('content');
    const platformUrl = url.origin;
    const platformImage = platformUrl + $('link[rel="apple-touch-icon"]').attr('href');
    const title = $('meta[property="og:title"]').attr('content')?.split(' |')[0];
    const author = $('#root > main > div > div > div.relative.z-1.h-87 > div.pt-16.px-11 > p.whitespace-pre-wrap.break-all.break-words.support-break-word.overflow-hidden.text-ellipsis.\!whitespace-nowrap.s12-regular-white.mt-4.opacity-75.text-center.leading-14').text().trim();

    const platform = new LinkDTO(platformImage as string, platformName as string, platformUrl as string);
    return new MetadataDTO(platform, title as string, author);
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