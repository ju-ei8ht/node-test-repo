import express, { type Request, type Response } from 'express';
import { allWebtoons } from './service';

const app = express();
app.use(express.json());

/**
 * 모든 웹툰 보기
 */
async function getWebtoons(req: Request, res: Response) {
    const result = await allWebtoons();
    return res.status(200).json(result);
};

export { getWebtoons }