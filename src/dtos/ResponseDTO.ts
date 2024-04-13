class SuccessDTO {
    private code: number;
    private message: string;

    constructor() {
        this.code = 200;
        this.message = 'OK';
    }

    getCode() {
        return this.code;
    }

    getMessage() {
        return this.message;
    }
}

class CreatedDTO {
    private code: number;
    private message: string;

    constructor() {
        this.code = 201;
        this.message = 'Created';
    }

    getCode() {
        return this.code;
    }

    getMessage() {
        return this.message;
    }
}

export { SuccessDTO, CreatedDTO }