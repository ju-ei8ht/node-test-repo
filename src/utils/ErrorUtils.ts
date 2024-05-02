import type { NextFunction, Request, Response } from "express";

class Error {
    private code: number;
    private message: string;

    constructor(code: number, message: string) {
        this.code = code;
        this.message = message;
    }

    getCode() {
        return this.code;
    }

    getMessage() {
        return this.message;
    }
}

class BadRequestError extends Error {

    constructor(message?: string) {
        if (message) super(400, message);
        else super(400, 'Bad Request');
    }

    getCode() {
        return super.getCode();
    }

    getMessage() {
        return super.getMessage();
    }
}

class NotFoundError extends Error {

    constructor(message?: string) {
        if (message) super(404, message);
        else super(404, 'Not Found');
    }

    getCode() {
        return super.getCode();
    }

    getMessage() {
        return super.getMessage();
    }
}

class AlreadyExistsError extends Error {

    constructor(message?: string) {
        if (message) super(409, message);
        else super(409, 'Already exists');
    }

    getCode() {
        return super.getCode();
    }

    getMessage() {
        return super.getMessage();
    }
}

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) res.status(err.getCode()).json(err);
    res.status(500).json(err);
};

export { Error, BadRequestError, NotFoundError, AlreadyExistsError, errorHandler }