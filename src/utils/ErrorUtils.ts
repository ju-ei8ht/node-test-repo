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

export { Error, BadRequestError, NotFoundError, AlreadyExistsError }