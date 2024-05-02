import type { NextFunction, Request, Response } from "express";

const frontController = (fn: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await fn(req, res, next).catch(next)
    }
}

export default frontController;