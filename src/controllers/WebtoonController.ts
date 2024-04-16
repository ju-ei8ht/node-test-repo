import { type Request, type Response } from 'express';
import { allWebtoons, registerWebtoon } from '../services/WebtoonService';
import { addBookmark } from '../services/BookmarkService';

/**
 * 모든 웹툰 보기
 */
async function getAllWebtoons(req: Request, res: Response) {
    const { page, size } = req.query;
    const result = await allWebtoons('', Number(page), Number(size));
    return res.status(200).json(result);
};

/**
 * 웹툰 및 북마크 등록
 */
async function postWebtoonAndBookmark(req: Request, res: Response) {
    const { url } = req.query;
    const parseUrl = new URL(url as string);
    const webtoonId = await registerWebtoon(parseUrl);

    const user = 'test@email.com'; // 임시 user
    const result = await addBookmark(webtoonId, user)
    return res.status(200).json(result);
};

export { getAllWebtoons, postWebtoonAndBookmark }