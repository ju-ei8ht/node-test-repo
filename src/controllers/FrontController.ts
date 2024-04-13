import type { NextFunction, Request, Response } from "express";

const frontController = (fn: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next)
    }
}

export default frontController;