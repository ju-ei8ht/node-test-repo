import { type Request, type Response } from 'express';
import { getWebtoonDetails, getWebtoons, registerWebtoon } from 'WebtoonService';
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
 * 웹툰 상세 보기
 */
async function getWebtoon(req: Request, res: Response) {
    const id = req.params.id;
    const user = req.query.user;
    const result = await getWebtoonDetails(Number(id), user as string);
    return res.status(200).json(result);
}

/**
 * 웹툰 및 북마크 등록
 */
async function postWebtoonAndBookmark(req: Request, res: Response) {
    const { url, user } = req.query;
    const parseUrl = new URL(url as string);
    const webtoonId = await registerWebtoon(parseUrl);

    const result = await addBookmark(webtoonId, user as string)
    return res.status(200).json(result);
}

export { getAllWebtoons, getBookmarkWebtoons, getWebtoon, postWebtoonAndBookmark }