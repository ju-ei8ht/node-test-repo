import { type Request, type Response } from 'express';
import { getWebtoons, registerWebtoon } from 'WebtoonService';
import { addBookmark } from 'BookmarkService';
import { Select } from 'WebtoonRepository';

/**
 * 모든 웹툰 보기
 */
async function getAllWebtoons(req: Request, res: Response) {
    const { user, page, size } = req.query;
    const result = await getWebtoons(Select.ALL, user as string, Number(page), Number(size));
    return res.status(200).json(result);
}

/**
 * 북마크한 웹툰 보기
 */
async function getBookmarkWebtoons(req: Request, res: Response) {
    const { user, page, size } = req.query;
    const result = await getWebtoons(Select.BOOKMARK, user as string, Number(page), Number(size));
    return res.status(200).json(result);
}

/**
 * 웹툰 및 북마크 등록
 */
async function postWebtoonAndBookmark(req: Request, res: Response) {
    const { url, user } = req.query;
    const parseUrl = new URL(url as string);
    const webtoonId = await registerWebtoon(parseUrl);

    // const user = 'test@email.com'; // 임시 user
    const result = await addBookmark(webtoonId, user as string)
    return res.status(200).json(result);
}

export { getAllWebtoons, getBookmarkWebtoons, postWebtoonAndBookmark }