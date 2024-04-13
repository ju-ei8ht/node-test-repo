import { type Request, type Response } from 'express';
import { allWebtoons, registerWebtoon } from '../services/WebtoonService';

/**
 * 모든 웹툰 보기
 */
async function getAllWebtoons(req: Request, res: Response) {
    const result = await allWebtoons();
    return res.status(200).json(result);
};

/**
 * 웹툰 등록
 */
async function postWebtoon(req: Request, res: Response) {
    const { url } = req.query;
    const parseUrl = new URL(url as string);
    const result = await registerWebtoon(parseUrl);
    return res.status(200).json(result);
};

export { getAllWebtoons, postWebtoon }